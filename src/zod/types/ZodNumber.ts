import { ZodType } from './ZodType.js';

export class ZodNumber extends ZodType<number> {
	constructor(
		parser = (data: unknown): number => {
			if (typeof data !== 'number') {
				throw new Error(
					`Expected a number, but got a ${typeof data} (${data})`
				);
			}

			return data;
		}
	) {
		super(parser);
	}

	min(min: number, message?: string): ZodNumber {
		return this.refine(
			(val) => val >= min,
			message || `Number must be at least ${min}`
		) as ZodNumber;
	}

	max(max: number, message?: string): ZodNumber {
		return this.refine(
			(val) => val <= max,
			message || `Number must be at most ${max}`
		) as ZodNumber;
	}
}
