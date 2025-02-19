import { ZodOptional } from './ZodOptional.js';

export abstract class ZodType<T> {
	protected constructor(protected readonly parser: (data: unknown) => T) {}

	parse(data: unknown): T {
		return this.parser(data);
	}

	protected withParser(newParser: (data: unknown) => T): this {
		return new (this.constructor as new (parser: (data: unknown) => T) => this)(
			newParser
		);
	}

	refine(check: (data: T) => boolean, message: string): this {
		return this.withParser((data: unknown) => {
			const parsed = this.parse(data);
			if (!check(parsed)) {
				throw new Error(message);
			}
			return parsed;
		});
	}

	safeParse(
		data: unknown
	): { success: true; data: T } | { success: false; error: unknown } {
		try {
			const parsed = this.parse(data);
			return { success: true, data: parsed };
		} catch (error) {
			return { success: false, error };
		}
	}

	coerce(coerceFn: (data: unknown) => unknown): this {
		return this.withParser((data) => {
			const coerced = coerceFn(data);
			return this.parse(coerced);
		});
	}

	optional(): ZodOptional<this> {
		return new ZodOptional(this);
	}
}
