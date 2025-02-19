import type { Infer } from '../index.js';
import { ZodType } from './ZodType.js';

export class ZodObject<T extends Record<string, any>> extends ZodType<T> {
	constructor(private shape: { [K in keyof T]: ZodType<T[K]> }) {
		super((data) => {
			if (typeof data !== 'object' || data === null) {
				throw new Error('Expected an object');
			}

			const result: any = {};
			for (const key in this.shape) {
				const validator = this.shape[key];
				result[key] = validator.parse((data as any)[key]);
			}

			return result;
		});
	}

	extend<U extends Record<string, ZodType<any>>>(
		newShape: U
	): ZodObject<T & { [K in keyof U]: Infer<U[K]> }> {
		return new ZodObject<T & { [K in keyof U]: Infer<U[K]> }>({
			...this.shape,
			...newShape,
		});
	}

	merge<U extends { [key: string]: any }>(
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
