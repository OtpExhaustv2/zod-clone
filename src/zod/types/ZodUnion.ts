import { ZodType, ZodValidationError } from './ZodType.js';

export class ZodUnion<
	T extends [ZodType<any>, ...ZodType<any>[]]
> extends ZodType<T[number]['_output']> {
	constructor(public options: T) {
		super((data: unknown) => {
			const errors: { path: (string | number)[]; message: string }[] = [];

			for (const option of this.options) {
				try {
					return option.parse(data);
				} catch (error) {
					if (error instanceof ZodValidationError) {
						errors.push(...error.errors);
					} else if (error instanceof Error) {
						errors.push({ path: [], message: error.message });
					}
				}
			}

			throw new ZodValidationError(
				errors.length > 0 ? errors : [{ path: [], message: 'Invalid input' }]
			);
		});
	}
}
