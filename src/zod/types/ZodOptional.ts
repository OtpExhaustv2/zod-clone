import type { Infer } from '../index.js';
import { ZodType } from './ZodType.js';

export class ZodOptional<S extends ZodType<any>> extends ZodType<
	Infer<S> | undefined
> {
	constructor(public inner: S) {
		super((data) => {
			if (data === undefined) {
				return undefined;
			}

			return this.inner.parse(data);
		});
	}
}
