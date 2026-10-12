import { db } from '@/db';
import { events } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { NextRequest } from 'next/server';
import { and, asc, eq, gte } from 'drizzle-orm';

export async function GET(req: NextRequest) {
	return apiHandler(async () => {
		const allEvents = await db
			.select()
			.from(events)
			.where(and(eq(events.isActive, true), gte(events.eventDate, new Date())))
			.orderBy(asc(events.eventDate));
		return allEvents;
	});
}
