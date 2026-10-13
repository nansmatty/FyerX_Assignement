import { db } from '@/db';
import { eventCardDesigns, events } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { ApiError } from '@/lib/errors/api-error';
import { verifyToken } from '@/lib/utils/verifyToken';
import { and, eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

type RouteParamsCtx = {
	params: Promise<{ id: string }>;
};

export async function GET(req: NextRequest, { params }: RouteParamsCtx) {
	return apiHandler(async () => {
		const loggedUser = await verifyToken();

		const { id } = await params;

		const [event] = await db.select({ id: events.id }).from(events).where(eq(events.id, id)).limit(1);

		if (!event) {
			throw new ApiError(404, 'Event not found');
		}

		const [design] = await db
			.select()
			.from(eventCardDesigns)
			.where(and(eq(eventCardDesigns.eventId, id), eq(eventCardDesigns.userId, loggedUser.userId)))
			.limit(1);

		return (
			design ?? {
				background: 'default',
				stickers: [],
			}
		);
	});
}
