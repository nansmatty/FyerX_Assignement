import EventCard, { EventItem } from '@/components/events/event-card';
import { db } from '@/db';
import { events } from '@/db/schemas';
import { and, asc, eq, gte } from 'drizzle-orm';

export default async function EventsPage() {
	const upcomingEvents = await db
		.select()
		.from(events)
		.where(and(eq(events.isActive, true), gte(events.eventDate, new Date())))
		.orderBy(asc(events.eventDate));

	return (
		<main className='mx-auto min-h-screen max-w-7xl px-5 py-10'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold'>Discover Events</h1>
				<p className='mt-2 text-slate-500'>Find upcoming events that interest you</p>
			</div>

			{upcomingEvents.length === 0 ? (
				<p className='text-slate-500'>No upcoming events found.</p>
			) : (
				<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
					{upcomingEvents.map((event) => (
						<EventCard
							key={event.id}
							event={{ ...event, eventDate: event.eventDate.toISOString() } as EventItem}
						/>
					))}
				</div>
			)}
		</main>
	);
}
