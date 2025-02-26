import type { Infer } from '../index.js';
import { ZodType } from './ZodType.js';

export class ZodIntersection<
	A extends ZodType<any>,
	B extends ZodType<any>
> extends ZodType<Infer<A> & Infer<B>> {
	constructor(public left: A, public right: B) {
		super((data: unknown) => {
			const a = left.parse(data);
			const b = right.parse(data);

			return { ...a, ...b };
		});
	}
}
