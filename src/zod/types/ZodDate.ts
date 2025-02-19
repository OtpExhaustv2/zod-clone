import { ZodType } from './ZodType.js';

export class ZodDate extends ZodType<Date> {
	constructor(
		parser = (data: unknown): Date => {
			if (!(data instanceof Date)) {
				throw new Error('Expected a Date');
			}

			return new Date(data);
		}
	) {
		super(parser);
	}
}
