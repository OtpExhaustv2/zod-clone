import type { Infer } from '../index.js';
import { ZodType } from './ZodType.js';

export class ZodDefault<S extends ZodType<any>> extends ZodType<Infer<S>> {
	constructor(public inner: S, public defaultValue: Infer<S>) {
		super((data) => {
			if (data === undefined) {
				return defaultValue;
			}

			return inner.parse(data);
		});
	}
}
