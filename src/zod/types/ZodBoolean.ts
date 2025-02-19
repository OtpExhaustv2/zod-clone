import { ZodType } from './ZodType.js';

export class ZodBoolean extends ZodType<boolean> {
	constructor(
		parser = (data: unknown): boolean => {
			if (typeof data !== 'boolean') {
				throw new Error('Expected a boolean');
			}

			return data;
		}
	) {
		super(parser);
	}
}
