import { ZodArray } from './types/ZodArray.js';
import { ZodBoolean } from './types/ZodBoolean.js';
import { ZodDate } from './types/ZodDate.js';
import { ZodEnum } from './types/ZodEnum.js';
import { ZodIntersection } from './types/ZodIntersection.js';
import { ZodNativeEnum } from './types/ZodNativeEnum.js';
import { ZodNumber } from './types/ZodNumber.js';
import { ZodObject } from './types/ZodObject.js';
import { ZodString } from './types/ZodString.js';
import { ZodTuple } from './types/ZodTuple.js';
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
	enum: <T extends string | number>(values: T[]) => new ZodEnum(values),
	nativeEnum: <T extends Record<string, string | number>>(enumObject: T) =>
		new ZodNativeEnum(enumObject),
	intersection: <A extends ZodType<any>, B extends ZodType<any>>(
		left: A,
		right: B
	) => new ZodIntersection(left, right),
	tuple: <T extends [ZodType<any>, ...ZodType<any>[]]>(...schemas: T) =>
		new ZodTuple(schemas),
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

type OptionalKeys<T> = {
	[K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type MakeOptional<T> = Omit<T, OptionalKeys<T>> &
	Partial<Pick<T, OptionalKeys<T>>>;

type Flatten<T> = { [K in keyof T]: T[K] };

type Infer<S extends ZodType<any>> = S['_output'] extends object
	? Flatten<MakeOptional<S['_output']>>
	: S['_output'];

export type { Infer, Zod };

export default z;
