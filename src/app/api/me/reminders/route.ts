import { db } from '@/db';
import { eventReminders, events } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { verifyToken } from '@/lib/utils/verifyToken';
import { and, asc, eq, gte, inArray } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	return apiHandler(async () => {
		const loggedUser = await verifyToken();

		const userReminderEvents = await db.select().from(eventReminders).where(eq(eventReminders.userId, loggedUser.userId));

		const eventIds = userReminderEvents.map((reminder) => reminder.eventId);

		if (eventIds.length === 0) {
			return [];
		}

		const reminders = await db
			.select()
			.from(events)
			.where(and(inArray(events.id, eventIds), eq(events.isActive, true), gte(events.eventDate, new Date())))
			.orderBy(asc(events.eventDate));

		return reminders;
	});
}
