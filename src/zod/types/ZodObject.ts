import type { Infer } from '../index.js';
import { ZodType, ZodValidationError } from './ZodType.js';

export type ObjectShapeToType<T extends Record<string, ZodType<any>>> = {
	[K in keyof T]: Infer<T[K]>;
};

export class ZodObject<T extends Record<string, any>> extends ZodType<T> {
	constructor(private shape: { [K in keyof T]: ZodType<T[K]> }) {
		super((data) => {
			if (typeof data !== 'object' || data === null) {
				throw new Error(
					`Expected an object, but got a ${typeof data} (${data})`
				);
			}

			const result: any = {};
			const errors: { path: (string | number)[]; message: string }[] = [];

			for (const key in this.shape) {
				try {
					const validator = this.shape[key];
					result[key] = validator.parse((data as any)[key]);
				} catch (err) {
					if (err instanceof ZodValidationError) {
						errors.push(
							...err.errors.map((e) => ({
								path: [key, ...e.path],
								message: e.message,
							}))
						);
					} else if (err instanceof Error) {
						errors.push({ path: [key], message: err.message });
					} else {
						errors.push({ path: [key], message: '' + err });
					}
				}
			}

			if (errors.length > 0) {
				throw new ZodValidationError(errors);
			}

			return result;
		});
	}

	extend<U extends { [key: string]: any }>(
		other: ZodObject<U>
	): ZodObject<T & U> {
		return new ZodObject<T & U>({
			...this.shape,
			...other._getShape(),
		} as { [K in keyof (T & U)]: ZodType<(T & U)[K]> });
	}

	_getShape(): { [K in keyof T]: ZodType<T[K]> } {
		return this.shape;
	}
}
