'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import EventForm from '@/components/admin/event-form';
import type { EventItem } from '@/types/event';

export default function EditEventPage() {
	const { id } = useParams<{ id: string }>();

	const [event, setEvent] = useState<EventItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function loadEvent() {
			try {
				const response = await fetch(`/api/admin/events/${id}`);

				if (!response.ok) {
					throw new Error('Failed to fetch event');
				}

				const { data } = await response.json();
				setEvent(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		}

		loadEvent();
	}, [id]);

	if (loading) return <p className='p-10'>Loading event...</p>;

	if (error) {
		return <p className='p-10 text-red-600'>{error}</p>;
	}

	if (!event) return <p className='p-10'>Event not found.</p>;

	return (
		<main className='mx-auto max-w-3xl px-5 py-10'>
			<h1 className='mb-8 text-3xl font-bold'>Edit Event</h1>

			<EventForm
				eventId={id}
				initialValues={{
					title: event.title,
					description: event.description ?? '',
					categoryId: event.categoryId,
					city: event.city,
					venue: event.venue,
					eventDate: toDateTimeLocal(event.eventDate),
					price: String(event.price),
					imageUrl: event.imageUrl ?? '',
					isActive: event.isActive,
				}}
			/>
		</main>
	);
}

function toDateTimeLocal(value: string) {
	const date = new Date(value);

	const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

	return localDate.toISOString().slice(0, 16);
}
