'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { EventItem } from '@/types/event';

export default function MyReminders() {
	const [reminders, setReminders] = useState<EventItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [removingId, setRemovingId] = useState<string | null>(null);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchReminders() {
			try {
				const response = await fetch('/api/me/reminders');

				if (!response.ok) {
					throw new Error('Failed to load reminders');
				}

				const { data } = await response.json();
				setReminders(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		}

		fetchReminders();
	}, []);

	async function removeReminder(eventId: string) {
		try {
			setRemovingId(eventId);
			setError('');

			const response = await fetch(`/api/events/${eventId}/reminder`, { method: 'PUT' });

			if (!response.ok) {
				throw new Error('Failed to remove reminder');
			}

			const { data } = await response.json();

			if (data.reminderEnabled !== false) {
				throw new Error('Reminder was not removed');
			}

			setReminders((previous) => previous.filter((event) => event.id !== eventId));
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
		} finally {
			setRemovingId(null);
		}
	}

	return (
		<section className='mt-8 rounded-2xl border border-slate-200 bg-white p-6'>
			<h2 className='text-xl font-semibold'>My Reminders</h2>
			<p className='mt-2 text-sm text-slate-500'>Your saved upcoming events.</p>

			{error && (
				<p role='alert' className='mt-4 text-sm text-red-600'>
					{error}
				</p>
			)}

			{loading ? (
				<p className='mt-6 text-slate-500'>Loading reminders...</p>
			) : reminders.length === 0 ? (
				<p className='mt-6 text-slate-500'>You haven't saved any upcoming events.</p>
			) : (
				<div className='mt-6 space-y-4'>
					{reminders.map((event) => (
						<div key={event.id} className='flex flex-col gap-4 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between'>
							<div>
								<Link href={`/events/${event.id}`} className='font-semibold hover:text-indigo-600'>
									{event.title}
								</Link>

								<p className='mt-1 text-sm text-slate-500'>
									{new Date(event.eventDate).toLocaleDateString('en-IN')}
									{' • '}
									{event.city}
								</p>
							</div>

							<button
								type='button'
								disabled={removingId === event.id}
								onClick={() => removeReminder(event.id)}
								className='rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50'>
								{removingId === event.id ? 'Removing...' : 'Remove Reminder'}
							</button>
						</div>
					))}
				</div>
			)}
		</section>
	);
}
