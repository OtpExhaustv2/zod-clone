import { ZodType } from './ZodType.js';

export class ZodString extends ZodType<string> {
	constructor(
		parser = (data: unknown): string => {
			if (typeof data !== 'string') {
				throw new Error('Expected a string');
			}

			return data;
		}
	) {
		super(parser);
	}

	min(minLength: number, message?: string): ZodString {
		return this.refine(
			(val) => val.length >= minLength,
			message || `String must be at least ${minLength} characters long`
		) as ZodString;
	}

	max(maxLength: number, message?: string): ZodString {
		return this.refine(
			(val) => val.length <= maxLength,
			message || `String must be at most ${maxLength} characters long`
		) as ZodString;
	}
}
