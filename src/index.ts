import z from './zod/index.js';

const baseSchema = z.object({
	username: z.string().min(3).max(20).default('John Doe'),
	age: z.number().min(18, 'You must be at least 18 years old'),
	id: z.coerce.number().optional(),
});

const addressSchema = z.object({
	address: z.string().min(3).max(20),
});

const full = baseSchema.extend(addressSchema);

const result = full.safeParse({
	age: 17,
	id: '123',
	address: '10540',
});

console.dir(result, { depth: null });
