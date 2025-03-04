import { ZodArray } from './types/ZodArray.js';
import { ZodBoolean } from './types/ZodBoolean.js';
import { ZodCustom, ZodCustomAsync } from './types/ZodCustom.js';
import { ZodDate } from './types/ZodDate.js';
import { ZodEnum } from './types/ZodEnum.js';
import { ZodIntersection } from './types/ZodIntersection.js';
import { ZodLazy } from './types/ZodLazy.js';
import { ZodLiteral } from './types/ZodLiteral.js';
import { ZodNativeEnum } from './types/ZodNativeEnum.js';
import { ZodNumber } from './types/ZodNumber.js';
import { ZodObject } from './types/ZodObject.js';
import { ZodRecord } from './types/ZodRecord.js';
import { ZodString } from './types/ZodString.js';
import { ZodTuple } from './types/ZodTuple.js';
import { ZodPipeline, ZodType } from './types/ZodType.js';
import { ZodUnion } from './types/ZodUnion.js';

const z = {
	string: () => new ZodString(),
	number: () => new ZodNumber(),
	boolean: () => new ZodBoolean(),
	date: () => new ZodDate(),
	literal: <T extends string | number | boolean | null>(value: T) =>
		new ZodLiteral(value),
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
	union: <T extends [ZodType<any>, ...ZodType<any>[]]>(...options: T) =>
		new ZodUnion(options),
	record: <K extends ZodType<string | number>, V extends ZodType<any>>(
		keyType: K,
		valueType: V
	) => new ZodRecord(keyType, valueType),
	pipe: <A, B>(first: ZodType<A>, second: ZodType<B>) =>
		new ZodPipeline(first, second),
	custom: <T>(validator: (data: unknown) => T) => new ZodCustom<T>(validator),
	customAsync: <T>(validator: (data: unknown) => Promise<T>) =>
		new ZodCustomAsync<T>(validator),
	lazy: <T>(getter: () => ZodType<T>) => new ZodLazy<T>(getter),
	coerce: {
		string: () =>
			z.string().coerce((data) => {
				if (data === null || data === undefined) return '';
				return String(data);
			}),
		number: () =>
			z.number().coerce((data) => {
				if (data === null || data === undefined) return 0;
				return Number(data);
			}),
		boolean: () =>
			z.boolean().coerce((data) => {
				if (data === 'true') return true;
				if (data === 'false') return false;
				return Boolean(data);
			}),
		date: () =>
			z.date().coerce((data) => {
				if (typeof data === 'string' || typeof data === 'number') {
					return new Date(data);
				}
				return new Date();
			}),
	},
};

export default z;

// Types
export {
	ZodArray,
	ZodBoolean,
	ZodCustom,
	ZodDate,
	ZodEnum,
	ZodIntersection,
	ZodLiteral,
	ZodNativeEnum,
	ZodNumber,
	ZodObject,
	ZodPipeline,
	ZodRecord,
	ZodString,
	ZodTuple,
	ZodUnion,
};
export type { ZodType };

type OptionalKeys<T> = {
	[K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type MakeOptional<T> = Omit<T, OptionalKeys<T>> &
	Partial<Pick<T, OptionalKeys<T>>>;

type Flatten<T> = { [K in keyof T]: T[K] };

type Infer<S extends ZodType<any>> = S['_output'] extends object
	? Flatten<MakeOptional<S['_output']>>
	: S['_output'];

export type { Infer };
