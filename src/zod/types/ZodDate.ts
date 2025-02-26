import { ZodType } from './ZodType.js';

export class ZodDate extends ZodType<Date> {
	constructor(
		parser = (data: unknown): Date => {
			if (data instanceof Date) return data;
			if (typeof data === 'string' || typeof data === 'number') {
				const date = new Date(data);
				if (isNaN(date.getTime())) {
					throw new Error('Invalid date');
				}

				return date;
			}

			throw new Error(`Expected a Date, but got a ${typeof data} (${data})`);
		}
	) {
		super(parser);
	}
}
