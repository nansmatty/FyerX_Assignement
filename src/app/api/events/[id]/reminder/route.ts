import { db } from '@/db';
import { events, eventReminders } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { verifyToken } from '@/lib/utils/verifyToken';
import { and, eq, gte } from 'drizzle-orm';
import { ApiError } from '@/lib/errors/api-error';
import { NextRequest } from 'next/server';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return apiHandler(async () => {
		const loggedUser = await verifyToken();
		const { id } = await params;

		// Check whether the event exists and is upcoming
		const [event] = await db
			.select({ id: events.id })
			.from(events)
			.where(and(eq(events.id, id), eq(events.isActive, true), gte(events.eventDate, new Date())))
			.limit(1);

		if (!event) {
			throw new ApiError(404, 'Event not found or no longer available');
		}

		// Check existing reminder
		const [existingReminder] = await db
			.select()
			.from(eventReminders)
			.where(and(eq(eventReminders.userId, loggedUser.userId), eq(eventReminders.eventId, id)))
			.limit(1);

		// Remove reminder if already set
		if (existingReminder) {
			await db.delete(eventReminders).where(and(eq(eventReminders.userId, loggedUser.userId), eq(eventReminders.eventId, id)));

			return {
				message: 'Reminder removed successfully',
				reminderEnabled: false,
			};
		}

		// Create reminder
		await db.insert(eventReminders).values({
			userId: loggedUser.userId,
			eventId: id,
		});

		return {
			message: 'Reminder added successfully',
			reminderEnabled: true,
		};
	});
}
