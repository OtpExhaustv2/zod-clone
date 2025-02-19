import { ZodArray } from './types/ZodArray.js';
import { ZodBoolean } from './types/ZodBoolean.js';
import { ZodDate } from './types/ZodDate.js';
import { ZodNumber } from './types/ZodNumber.js';
import { ZodObject } from './types/ZodObject.js';
import { ZodString } from './types/ZodString.js';
import type { ZodType } from './types/ZodType.js';

const z = {
	string: () => new ZodString(),
	number: () => new ZodNumber(),
	boolean: () => new ZodBoolean(),
	date: () => new ZodDate(),
	object: <T extends Record<string, any>>(shape: {
		[K in keyof T]: ZodType<T[K]>;
	}) => new ZodObject(shape),
	array: <T>(itemType: ZodType<T>) => new ZodArray(itemType),
	coerce: {
		string: () =>
			z.string().coerce((data) => {
				return data === undefined || data === null ? '' : '' + data;
			}),
		number: () =>
			z.number().coerce((data) => {
				if (typeof data === 'string') {
					return +data;
				}

				return data;
			}),
	},
};

type Zod = typeof z;
type Infer<S extends ZodType<any>> = S['_output'];

export type { Infer, Zod };

export default z;
