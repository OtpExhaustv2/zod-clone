import { ZodType } from './ZodType.js';

export class ZodLiteral<
	T extends string | number | boolean | null
> extends ZodType<T> {
	constructor(public value: T) {
		super((data: unknown) => {
			if (data !== this.value) {
				throw new Error(
					`Expected ${JSON.stringify(this.value)}, received ${JSON.stringify(
						data
					)}`
				);
			}
			return data as T;
		});
	}
}
