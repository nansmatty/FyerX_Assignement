import { z } from 'zod';

export const cardDesignSchema = z.object({
	background: z.enum(['default', 'theme2', 'theme3']).default('default'),
	stickers: z
		.array(z.enum(['star', 'heart', 'gift', 'balloon', 'sparkle']))
		.max(3)
		.refine((stickers) => new Set(stickers).size === stickers.length, {
			message: 'Duplicate stickers are not allowed',
		}),
});

export type CardDesign = z.infer<typeof cardDesignSchema>;
