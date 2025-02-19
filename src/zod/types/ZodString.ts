import { ZodType } from './ZodType.js';

export class ZodString extends ZodType<string> {
	constructor(
		parser = (data: unknown): string => {
			if (typeof data !== 'string') {
				throw new Error(
					`Expected a string, but got a ${typeof data} (${data})`
				);
			}

			return data;
		}
	) {
		super(parser);
	}

	min(minLength: number, message?: string): this {
		return this.refine(
			(val) => val.length >= minLength,
			message || `String must be at least ${minLength} characters long`
		) as this;
	}

	max(maxLength: number, message?: string): this {
		return this.refine(
			(val) => val.length <= maxLength,
			message || `String must be at most ${maxLength} characters long`
		) as this;
	}
}
