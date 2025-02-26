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

	regex(pattern: RegExp, message?: string): this {
		return this.refine(
			(val) => pattern.test(val),
			message || `String must match the pattern ${pattern.source}`
		) as this;
	}

	email(message?: string): this {
		return this.regex(
			/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
			message || 'String must be a valid email address'
		);
	}
}
