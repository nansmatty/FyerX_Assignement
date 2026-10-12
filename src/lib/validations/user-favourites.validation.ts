import { z } from 'zod';

export const userFavouritesSchema = z.object({
	categoryId: z.array(z.uuid()).max(20),
});

export type UserFavourites = z.infer<typeof userFavouritesSchema>;
