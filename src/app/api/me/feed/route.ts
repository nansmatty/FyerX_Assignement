import { db } from '@/db';
import { eventCardDesigns, events, userFavourites } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { verifyToken } from '@/lib/utils/verifyToken';
import { and, asc, eq, gte, inArray } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	return apiHandler(async () => {
		const loggedUser = await verifyToken();

		const userFavoritesCategories = await db.select().from(userFavourites).where(eq(userFavourites.userId, loggedUser.userId));

		const categoryIds = userFavoritesCategories.map((fav) => fav.categoryId);

		if (categoryIds.length === 0) {
			return [];
		}

		const favouriteEvents = await db
			.select({
				event: events,
				cardDesign: {
					background: eventCardDesigns.background,
					stickers: eventCardDesigns.stickers,
				},
			})
			.from(events)
			.leftJoin(eventCardDesigns, and(eq(events.id, eventCardDesigns.eventId), eq(eventCardDesigns.userId, loggedUser.userId)))
			.where(and(inArray(events.categoryId, categoryIds), eq(events.isActive, true), gte(events.eventDate, new Date())))
			.orderBy(asc(events.eventDate));

		return favouriteEvents.map(({ event, cardDesign }) => ({
			...event,
			cardDesign: cardDesign?.background
				? {
						background: cardDesign.background,
						stickers: cardDesign.stickers,
					}
				: null,
		}));
	});
}
