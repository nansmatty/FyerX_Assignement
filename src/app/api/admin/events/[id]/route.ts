import { apiHandler } from '@/lib/api-handler';
import { requireAdmin } from '@/lib/utils/requireAdmin';
import { NextRequest } from 'next/server';
import { eventIdValidation, updateEventValidation } from '@/lib/validations/event.validation';
import { ApiError } from '@/lib/errors/api-error';
import { db } from '@/db';
import { events } from '@/db/schemas';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return apiHandler(async () => {
		await requireAdmin();
		const { id } = await params;
		const idValidation = eventIdValidation.safeParse(id);

		if (!idValidation.success) {
			throw new ApiError(400, 'Invalid event ID');
		}

		const [event] = await db.select().from(events).where(eq(events.id, idValidation.data)).limit(1);

		if (!event) {
			throw new ApiError(404, 'Event not found');
		}

		return event;
	});
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return apiHandler(async () => {
		await requireAdmin();

		const { id } = await params;
		const idValidation = eventIdValidation.safeParse(id);

		if (!idValidation.success) {
			throw new ApiError(400, 'Invalid event ID');
		}

		const body = await req.json();
		const validateBodyData = updateEventValidation.safeParse(body);

		if (!validateBodyData.success) {
			throw new ApiError(400, JSON.stringify({ errors: validateBodyData.error.issues }));
		}

		const validatedData = validateBodyData.data;
		const { eventDate, price, ...eventData } = validatedData;

		const [updatedEvent] = await db
			.update(events)
			.set({
				...eventData,
				...(eventDate !== undefined && {
					eventDate: new Date(eventDate),
				}),
				...(price !== undefined && {
					price: price.toString(),
				}),
			})
			.where(eq(events.id, idValidation.data))
			.returning();

		if (!updatedEvent) {
			throw new ApiError(404, 'Event not found');
		}

		return updatedEvent;
	});
}
