import { ZodType } from './ZodType.js';

export class ZodEnum<T extends string | number> extends ZodType<T> {
	constructor(public values: T[]) {
		super((data: unknown) => {
			if (!values.includes(data as T)) {
				throw new Error(`Expected ${values.join(', ')}, but got ${data}`);
			}

			return data as T;
		});
	}
}
