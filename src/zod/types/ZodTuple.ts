import type { Infer } from '../index.js';
import { ZodType } from './ZodType.js';

export class ZodTuple<
	Schemas extends [ZodType<any>, ...ZodType<any>[]]
> extends ZodType<{ [K in keyof Schemas]: Infer<Schemas[K]> }> {
	constructor(public schemas: Schemas) {
		super((data: unknown) => {
			if (!Array.isArray(data)) {
				throw new Error(
					`Expected an array, but got a ${typeof data} (${data})`
				);
			}

			if (data.length !== this.schemas.length) {
				throw new Error(
					`Expected an array of length ${this.schemas.length}, but got a ${data.length}`
				);
			}

			return data.map((item, index) => this.schemas[index].parse(item)) as {
				[K in keyof Schemas]: Infer<Schemas[K]>;
			};
		});
	}
}
