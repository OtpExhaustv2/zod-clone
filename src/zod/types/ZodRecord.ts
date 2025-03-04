import { ZodType, ZodValidationError } from './ZodType.js';

export class ZodRecord<
	K extends ZodType<string | number>,
	V extends ZodType<any>
> extends ZodType<Record<K['_output'], V['_output']>> {
	constructor(public keyType: K, public valueType: V) {
		super((data: unknown) => {
			if (typeof data !== 'object' || data === null || Array.isArray(data)) {
				throw new Error(`Expected object, received ${typeof data}`);
			}

			const errors: { path: (string | number)[]; message: string }[] = [];
			const result: Record<string | number, any> = {};

			for (const [key, value] of Object.entries(data)) {
				try {
					const validatedKey = this.keyType.parse(key);
					const validatedValue = this.valueType.parse(value);

					result[validatedKey] = validatedValue;
				} catch (error) {
					if (error instanceof ZodValidationError) {
						errors.push(
							...error.errors.map((err) => ({
								path: [key, ...err.path],
								message: err.message,
							}))
						);
					} else if (error instanceof Error) {
						errors.push({ path: [key], message: error.message });
					}
				}
			}

			if (errors.length > 0) {
				throw new ZodValidationError(errors);
			}

			return result as Record<K['_output'], V['_output']>;
		});
	}
}
