import { ZodAsyncType, ZodType } from './ZodType.js';

export class ZodCustom<T> extends ZodType<T> {
	constructor(private readonly validator: (data: unknown) => T) {
		super((data: unknown) => {
			return this.validator(data);
		});
	}
}

export class ZodCustomAsync<T> extends ZodAsyncType<T> {
	constructor(private readonly validator: (data: unknown) => Promise<T>) {
		// We need to pass a synchronous function to the parent constructor
		// The actual async parsing will be handled in parseAsync
		super((data: unknown) => {
			// This is a placeholder - the actual parsing happens in parseAsync
			throw new Error(
				'ZodCustomAsync requires using parseAsync instead of parse'
			);
		});
	}

	// Override parseAsync to use our validator
	async parseAsync(data: unknown): Promise<T> {
		return await this.validator(data);
	}
}
