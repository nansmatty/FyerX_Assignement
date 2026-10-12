import { db } from '@/db';
import { events } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { NextRequest } from 'next/server';
import { and, eq, gte } from 'drizzle-orm';
import { eventIdValidation } from '@/lib/validations/event.validation';
import { ApiError } from '@/lib/errors/api-error';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return apiHandler(async () => {
		const { id } = await params;
		const idValidation = eventIdValidation.safeParse(id);

		if (!idValidation.success) {
			throw new ApiError(400, 'Invalid event ID');
		}

		const [event] = await db
			.select()
			.from(events)
			.where(and(eq(events.isActive, true), eq(events.id, idValidation.data), gte(events.eventDate, new Date())))
			.limit(1);

		if (!event) {
			throw new ApiError(404, 'Event not found');
		}

		return event;
	});
}
