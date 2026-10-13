'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { EventItem } from '@/types/event';
import Link from 'next/link';

export default function EventPage() {
	const params = useParams<{ id: string }>();

	const [event, setEvent] = useState<EventItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [reminderEnabled, setReminderEnabled] = useState(false);
	const [reminderLoading, setReminderLoading] = useState(false);

	useEffect(() => {
		async function fetchEvent() {
			try {
				const response = await fetch(`/api/events/${params.id}`);

				if (!response.ok) {
					throw new Error('Failed to fetch event');
				}

				const { data } = await response.json();
				setEvent(data);
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		}
		fetchEvent();
	}, [params.id]);

	async function handleToggleReminder() {
		try {
			setReminderLoading(true);
			const response = await fetch(`/api/events/${params.id}/reminder`, {
				method: 'PUT',
			});

			if (!response.ok) {
				throw new Error('Failed to set reminder');
			}

			const { data } = await response.json();

			setReminderEnabled(data.reminderEnabled);
		} catch (error) {
			setError(error instanceof Error ? error.message : 'Something went wrong');
		} finally {
			setReminderLoading(false);
		}
	}

	if (loading) {
		return <div className='mx-auto max-w-5xl p-10 text-center text-slate-500'>Loading event details...</div>;
	}

	if (error) {
		return <div className='mx-auto max-w-5xl p-10 text-center text-red-600'>{error}</div>;
	}

	if (!event) {
		return <p className='p-10 text-center'>Event not found.</p>;
	}

	return (
		<main className='min-h-screen bg-slate-50 px-5 py-10'>
			<div className='mx-auto max-w-5xl'>
				<Link href='/' className='mb-6 inline-block text-sm font-medium text-indigo-600 hover:underline'>
					← Back to events
				</Link>

				<div className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm'>
					<div className='bg-linear-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white md:p-12'>
						<span className='rounded-full bg-white/20 px-3 py-1 text-xs font-medium'>Upcoming Event</span>

						<h1 className='mt-5 text-3xl font-bold md:text-4xl'>{event.title}</h1>

						<p className='mt-3 text-indigo-400'>Discover more about this event.</p>
					</div>

					<div className='grid gap-10 p-6 md:grid-cols-3 md:p-10'>
						<section className='md:col-span-2'>
							<h2 className='mb-4 text-xl font-semibold'>About this event</h2>

							<p className='whitespace-pre-line leading-7 text-slate-600'>{event.description || 'No description available.'}</p>
						</section>

						<aside className='h-fit rounded-xl border border-slate-200 bg-slate-50 p-6'>
							<h2 className='mb-5 text-lg font-semibold'>Event Information</h2>

							<div className='space-y-5 text-sm'>
								<div>
									<p className='text-slate-500'>Date & Time</p>
									<p className='mt-1 font-medium'>
										{new Date(event.eventDate).toLocaleString('en-IN', {
											dateStyle: 'long',
											timeStyle: 'short',
										})}
									</p>
								</div>

								<div>
									<p className='text-slate-500'>Location</p>
									<p className='mt-1 font-medium'>{event.city}</p>
								</div>

								<div>
									<p className='text-slate-500'>Ticket Price</p>
									<p className='mt-1 text-xl font-bold text-indigo-600'>₹{event.price}</p>
								</div>
							</div>

							<div className='mt-7 space-y-3'>
								<button
									type='button'
									onClick={handleToggleReminder}
									disabled={reminderLoading}
									className='w-full rounded-lg bg-indigo-600 px-4 py-3 font-medium text-white transition hover:bg-indigo-700'>
									{reminderLoading ? 'Updating...' : reminderEnabled ? '🔕 Remove Reminder' : '🔔 Set Reminder'}
								</button>

								<Link
									href={`/events/${event.id}/card-design`}
									className='block w-full rounded-lg border border-indigo-200 bg-white px-4 py-3 text-center font-medium text-indigo-600 transition hover:bg-indigo-50'>
									🎨 Customize Card
								</Link>
							</div>
						</aside>
					</div>
				</div>
			</div>
		</main>
	);
}
