import { db } from '@/db';
import { events } from '@/db/schemas/events';
import { apiHandler } from '@/lib/api-handler';
import { ApiError } from '@/lib/errors/api-error';
import { requireAdmin } from '@/lib/utils/requireAdmin';
import { createEventValidation } from '@/lib/validations/event.validation';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	return apiHandler(async () => {
		const admin = await requireAdmin();

		const eventsList = await db.select().from(events);

		return eventsList;
	});
}

export async function POST(req: NextRequest) {
	return apiHandler(async () => {
		const admin = await requireAdmin();

		const body = await req.json();
		const validationRes = createEventValidation.safeParse(body);

		if (!validationRes.success) {
			throw new ApiError(400, JSON.stringify({ errors: validationRes.error.issues }));
		}

		const parsed = validationRes.data;

		const [newEvent] = await db
			.insert(events)
			.values({
				title: parsed.title,
				description: parsed.description,
				categoryId: parsed.categoryId,
				city: parsed.city,
				venue: parsed.venue,
				price: parsed.price.toString(),
				isActive: parsed.isActive,
				imageUrl: parsed.imageUrl,
				eventDate: new Date(parsed.eventDate),
				createdBy: admin.userId,
			})
			.returning({
				id: events.id,
				title: events.title,
			});

		// Handle the creation of the event here using parsed.data
		return {
			message: 'Event created successfully',
			event: newEvent,
		};
	}, 201);
}
