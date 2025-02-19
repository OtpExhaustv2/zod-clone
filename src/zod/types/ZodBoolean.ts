import { ZodType } from './ZodType.js';

export class ZodBoolean extends ZodType<boolean> {
	constructor(
		parser = (data: unknown): boolean => {
			if (typeof data !== 'boolean') {
				throw new Error(
					`Expected a boolean, but got a ${typeof data} (${data})`
				);
			}

			return data;
		}
	) {
		super(parser);
	}
}
