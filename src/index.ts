import z, { type ZodType } from './zod/index.js';

const runTest = (name: string, fn: () => void) => {
	console.log(`\n----- Testing ${name} -----`);
	try {
		fn();
		console.log(`✅ ${name} tests passed`);
	} catch (error) {
		console.error(`❌ ${name} tests failed:`, error);
	}
};

// Test basic types
runTest('Basic Types', () => {
	// String
	const stringSchema = z.string().min(3).max(20);
	console.log('String validation:', stringSchema.parse('hello'));

	// Number
	const numberSchema = z.number().min(18);
	console.log('Number validation:', numberSchema.parse(21));

	// Boolean
	const booleanSchema = z.boolean();
	console.log('Boolean validation:', booleanSchema.parse(true));

	// Date
	const dateSchema = z.date();
	console.log('Date validation:', dateSchema.parse(new Date()));

	const dateAsStringSchema = z.date();
	console.log(
		'Date as string validation:',
		dateAsStringSchema.parse('2023-01-01')
	);
});

// Test object and its methods
runTest('Object and Methods', () => {
	const userSchema = z.object({
		id: z.number(),
		name: z.string().min(2),
		email: z.string().min(5),
		age: z.number().min(18),
	});

	// Basic object validation
	console.log(
		'Object validation:',
		userSchema.parse({
			id: 1,
			name: 'John',
			email: 'john@example.com',
			age: 25,
		})
	);

	// Test pick
	const profileSchema = userSchema.pick(['name', 'email']);
	console.log(
		'Pick method:',
		profileSchema.parse({
			name: 'John',
			email: 'john@example.com',
		})
	);

	// Test omit
	const publicUserSchema = userSchema.omit(['email']);
	console.log(
		'Omit method:',
		publicUserSchema.parse({
			id: 1,
			name: 'John',
			age: 25,
		})
	);

	// Test extend
	const addressSchema = z.object({
		address: z.string(),
		city: z.string(),
		zipCode: z.string(),
	});

	const userWithAddressSchema = userSchema.extend(addressSchema);
	console.log(
		'Extend method:',
		userWithAddressSchema.parse({
			id: 1,
			name: 'John',
			email: 'john@example.com',
			age: 25,
			address: '123 Main St',
			city: 'New York',
			zipCode: '10001',
		})
	);

	// Test partial
	const partialSchema = userSchema.partial();
	console.log(
		'Partial method:',
		partialSchema.parse({
			name: 'John',
		})
	);
});

// Test union
runTest('Union', () => {
	const stringOrNumber = z.union(z.string(), z.number());
	console.log('Union with string:', stringOrNumber.parse('hello'));
	console.log('Union with number:', stringOrNumber.parse(123));
});

// Test literal
runTest('Literal', () => {
	const stringLiteral = z.literal('hello');
	const numberLiteral = z.literal(42);
	const booleanLiteral = z.literal(true);

	console.log('String literal:', stringLiteral.parse('hello'));
	console.log('Number literal:', numberLiteral.parse(42));
	console.log('Boolean literal:', booleanLiteral.parse(true));
});

// Test record
runTest('Record', () => {
	const stringToNumberRecord = z.record(z.string(), z.number());
	console.log(
		'Record validation:',
		stringToNumberRecord.parse({
			a: 1,
			b: 2,
			c: 3,
		})
	);
});

enum Status {
	Pending = 'pending',
	Completed = 'completed',
	Failed = 'failed',
}

// Test enum
runTest('Enum', () => {
	// String enum
	const fruitEnum = z.enum(['apple', 'banana', 'orange']);
	console.log('String enum:', fruitEnum.parse('apple'));

	// Native enum
	const statusEnum = z.nativeEnum(Status);
	console.log('Native enum:', statusEnum.parse(Status.Completed));
});

// Test array
runTest('Array', () => {
	const numberArray = z.array(z.number());
	console.log('Array validation:', numberArray.parse([1, 2, 3, 4, 5]));
});

// Test tuple
runTest('Tuple', () => {
	const pointTuple = z.tuple(z.number(), z.number(), z.string());
	console.log('Tuple validation:', pointTuple.parse([10, 20, 'point']));
});

// Test intersection
runTest('Intersection', () => {
	const personSchema = z.object({
		name: z.string(),
		age: z.number(),
	});

	const employeeSchema = z.object({
		role: z.string(),
		department: z.string(),
	});

	const personEmployeeSchema = z.intersection(personSchema, employeeSchema);
	console.log(
		'Intersection validation:',
		personEmployeeSchema.parse({
			name: 'John',
			age: 30,
			role: 'Developer',
			department: 'Engineering',
		})
	);
});

// Test coercion
runTest('Coercion', () => {
	const stringCoercion = z.coerce.string();
	console.log('String coercion from number:', stringCoercion.parse(123));
	console.log('String coercion from null:', stringCoercion.parse(null));

	const numberCoercion = z.coerce.number();
	console.log('Number coercion from string:', numberCoercion.parse('123'));
});

// Test complex schema with multiple features
runTest('Complex Schema', () => {
	// Define a complex user schema
	const userSchema = z.object({
		id: z.number(),
		name: z.string().min(2),
		status: z.nativeEnum(Status),
		tags: z.array(z.string()),
		metadata: z.record(
			z.string(),
			z.union(z.string(), z.number(), z.boolean())
		),
		preferences: z
			.object({
				theme: z.enum(['light', 'dark', 'system']),
				notifications: z.boolean(),
				language: z.literal('en-US'),
			})
			.partial(),
		contact: z.union(
			z.object({ type: z.literal('email'), value: z.string() }),
			z.object({ type: z.literal('phone'), value: z.string() })
		),
	});

	// Test with valid data
	const validUser = {
		id: 1,
		name: 'John Doe',
		status: Status.Completed,
		tags: ['developer', 'typescript'],
		metadata: {
			lastLogin: '2023-01-01',
			loginCount: 42,
			isActive: true,
		},
		preferences: {
			theme: 'dark',
			notifications: true,
		},
		contact: {
			type: 'email',
			value: 'john@example.com',
		},
	};

	console.log('Complex schema validation:', userSchema.parse(validUser));
});

// Test ZodPipeline
runTest('Pipeline', () => {
	// String to number pipeline using a custom function
	const stringToNumberSchema = z.string().pipe(
		z.custom((val) => {
			const num = Number(val);
			if (isNaN(num)) {
				throw new Error('Not a number');
			}
			return num;
		})
	);

	console.log('String to number pipeline:', stringToNumberSchema.parse('42'));

	// Using the pipe method for data transformation
	const validateThenTransform = z.string().pipe(
		z.custom((val) => {
			if (typeof val !== 'string') {
				throw new Error('Expected string');
			}
			return {
				length: val.length,
				value: val,
			};
		})
	);

	console.log('Pipe result:', validateThenTransform.parse('hello'));

	// More complex pipeline
	const usernamePipeline = z
		.string()
		.min(3)
		.pipe(
			z.custom((val) => {
				if (typeof val !== 'string') {
					throw new Error('Expected string');
				}
				return {
					username: val,
					normalized: val.toLowerCase(),
				};
			})
		);

	const result = usernamePipeline.parse('JohnDoe');
	console.log('Username pipeline result:', result);
});

// Test ZodCustomAsync
runTest('CustomAsync', async () => {
	// Create an async validator that simulates API validation
	const asyncEmailValidator = z.customAsync<string>(async (val) => {
		if (typeof val !== 'string') {
			throw new Error('Expected string');
		}

		// Simulate API call delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		if (!val.includes('@')) {
			throw new Error('Invalid email format');
		}

		return val.toLowerCase();
	});

	try {
		// This should be awaited since it returns a Promise
		const result = await asyncEmailValidator.parseAsync('Test@Example.com');
		console.log('Async email validation result:', result);

		// This would fail but we'll catch it
		await asyncEmailValidator.parseAsync('invalid-email');
	} catch (error) {
		console.log('Expected error from async validation:', error);
	}
});

// Test ZodLazy for recursive schemas
runTest('Lazy', () => {
	// Define a recursive comment schema
	type Comment = {
		text: string;
		replies: Comment[];
	};

	// Without lazy, this would cause an infinite recursion error
	const commentSchema: ZodType<Comment> = z.lazy(() =>
		z.object({
			text: z.string(),
			replies: z.array(commentSchema),
		})
	);

	const validComment = {
		text: 'Parent comment',
		replies: [
			{
				text: 'First reply',
				replies: [],
			},
			{
				text: 'Second reply',
				replies: [
					{
						text: 'Nested reply',
						replies: [],
					},
				],
			},
		],
	};

	console.log(
		'Recursive schema validation:',
		commentSchema.parse(validComment)
	);

	// Invalid comment (missing text field)
	try {
		commentSchema.parse({
			replies: [],
		});
	} catch (error) {
		console.log('Expected error from recursive schema:', error);
	}
});
