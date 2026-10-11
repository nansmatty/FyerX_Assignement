import { z } from 'zod';

export const createEventValidation = z.object({
	title: z.string().trim().min(1).max(255),

	description: z.string().trim().min(1),

	categoryId: z.uuid(),

	city: z.string().trim().min(1).max(255),

	venue: z.string().trim().min(1).max(255),

	eventDate: z.iso.datetime({ offset: true }),

	price: z
		.number()
		.min(0)
		.max(99999999.99)
		.refine((value) => Number.isInteger(value * 100), {
			message: 'Price can have at most 2 decimal places',
		}),

	imageUrl: z.url().optional(),

	isActive: z.boolean().optional(),
});

export type CreateEventValidation = z.infer<typeof createEventValidation>;
