import { ZodType } from './ZodType.js';

export class ZodNativeEnum<
	T extends Record<string, string | number>
> extends ZodType<T[keyof T]> {
	constructor(public enumObject: T) {
		super((data: unknown) => {
			const values = Object.values(enumObject) as T[keyof T][];
			if (!values.includes(data as T[keyof T])) {
				throw new Error(`Expected ${values.join(', ')}, but got ${data}`);
			}

			return data as T[keyof T];
		});
	}
}
