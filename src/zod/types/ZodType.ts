import type { Infer } from '../index.js';

export class ZodValidationError extends Error {
	public errors: { path: (string | number)[]; message: string }[];

	constructor(errors: { path: (string | number)[]; message: string }[]) {
		super('Validation failed');
		this.errors = errors;
	}
}

export abstract class ZodType<T> {
	public _output!: T;

	protected constructor(protected readonly parser: (data: unknown) => T) {}

	parse(data: unknown): T {
		return this.parser(data);
	}

	async parseAsync(data: unknown): Promise<T> {
		return this.parse(data);
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

	refineAsync(
		check: (data: T) => Promise<boolean> | boolean,
		message?: string
	): ZodAsyncType<T> {
		const parent = this;
		return new (class extends ZodAsyncType<T> {
			constructor() {
				super((data: unknown) => parent.parse(data));
			}
			async parseAsync(data: unknown): Promise<T> {
				const parsed = await parent.parseAsync(data);
				const ok = await Promise.resolve(check(parsed));
				if (!ok) {
					throw new Error(message || 'Async refinement failed');
				}
				return parsed;
			}
		})();
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

	async safeParseAsync(
		data: unknown
	): Promise<{ success: true; data: T } | { success: false; error: unknown }> {
		try {
			const result = await this.parseAsync(data);
			return { success: true, data: result };
		} catch (e) {
			return { success: false, error: e };
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

	default(defaultValue: Infer<this>): ZodDefault<this> {
		return new ZodDefault(this, defaultValue);
	}

	nullable(): ZodNullable<this> {
		return new ZodNullable(this);
	}
}

export class ZodOptional<S extends ZodType<any>> extends ZodType<
	Infer<S> | undefined
> {
	constructor(public inner: S) {
		super((data: unknown) => {
			if (data === undefined) {
				return undefined as Infer<S> | undefined;
			}
			return inner.parse(data);
		});
	}
}

export class ZodDefault<S extends ZodType<any>> extends ZodType<Infer<S>> {
	constructor(public inner: S, public defaultValue: Infer<S>) {
		super((data: unknown) => {
			if (data === undefined) return defaultValue;
			return inner.parse(data);
		});
	}
}

export class ZodTransform<S extends ZodType<any>, U> extends ZodType<U> {
	constructor(public inner: S, public transformFn: (data: Infer<S>) => U) {
		super((data: unknown) => {
			const parsed = this.inner.parse(data);
			return this.transformFn(parsed) as U;
		});
	}
}

export class ZodNullable<S extends ZodType<any>> extends ZodType<S | null> {
	constructor(public inner: S) {
		super((data: unknown) => {
			if (data === null) return null as Infer<S> | null;
			return inner.parse(data);
		});
	}
}

export abstract class ZodAsyncType<T> extends ZodType<T> {
	async safeParseAsync(
		data: unknown
	): Promise<{ success: true; data: T } | { success: false; error: unknown }> {
		try {
			const parsed = await this.parseAsync(data);
			return { success: true, data: parsed };
		} catch (error) {
			return { success: false, error };
		}
	}
}
