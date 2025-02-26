import z from './zod/index.js';

export enum Status {
	Pending = 'pending',
	Completed = 'completed',
	Failed = 'failed',
}

const baseSchema = z.object({
	username: z.string().min(3).max(20).default('John Doe'),
	age: z.number().min(18, 'You must be at least 18 years old'),
	id: z.coerce.number().nullable(),
	// test: z.tuple(z.string(), z.number()),
	// a: z.intersection(z.object({ a: z.string() }), z.object({ b: z.number() })),
});

const addressSchema = z.object({
	address: z.string().min(3).max(20),
});

const pickSchema = baseSchema.pick(['username', 'id']);

// const partialSchema = baseSchema.partial();
// type A = Infer<typeof partialSchema>;

const full = baseSchema.extend(addressSchema);

const result = pickSchema.safeParse({
	age: 18,
	id: null,
	address: '10540',
	test: ['1', 2],
	a: { a: '1' },
});

console.dir(result, { depth: null });

// const asyncSchema = z.string().refineAsync(async (val) => {
// 	await new Promise((resolve) => setTimeout(resolve, 1000));
// 	return !val.includes('bad');
// }, "Value cannot include 'bad'");

// asyncSchema
// 	.safeParseAsync('This is good')
// 	.then((result) => console.log('Async refinement pass:', result))
// 	.catch((err) => console.error('Async refinement fail:', err));

// asyncSchema
// 	.safeParseAsync('This is bad')
// 	.then((result) => console.log('Async refinement pass:', result))
// 	.catch((err) => console.error('Async refinement fail:', err));
