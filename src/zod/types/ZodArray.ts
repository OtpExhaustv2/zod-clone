import { ZodType } from './ZodType.js';

export class ZodArray<T> extends ZodType<T[]> {
	constructor(private itemType: ZodType<T>) {
		super((data) => {
			if (!Array.isArray(data)) {
				throw new Error(
					`Expected an array, but got a ${typeof data} (${data})`
				);
			}

			return data.map((item) => this.itemType.parse(item));
		});
	}
}
