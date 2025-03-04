import { ZodType } from './ZodType.js';

export class ZodLazy<T> extends ZodType<T> {
	constructor(private readonly getter: () => ZodType<T>) {
		super((data: unknown) => {
			const schema = this.getter();
			return schema.parse(data);
		});
	}
}
