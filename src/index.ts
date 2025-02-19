import z from './zod/index.js';

const schema = z.object({
	username: z.string().min(3).max(20),
	age: z.number().min(18, 'You must be at least 18 years old'),
	id: z.coerce.number(),
});

const result = schema.safeParse({
	username: 'aaa',
	age: 18,
	id: '123',
});

console.log(result);
