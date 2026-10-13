'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import EventCard from '@/components/events/event-card';
import type { EventItem } from '@/types/event';

export default function FeedPage() {
	const [events, setEvents] = useState<EventItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchFeed() {
			try {
				const response = await fetch('/api/me/feed');

				if (!response.ok) {
					throw new Error('Failed to load personalized feed');
				}

				const { data } = await response.json();
				setEvents(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		}

		fetchFeed();
	}, []);

	return (
		<main className='mx-auto min-h-screen max-w-7xl px-5 py-10'>
			<div className='mb-8 flex flex-wrap items-center justify-between gap-4'>
				<div>
					<h1 className='text-3xl font-bold'>Your Event Feed</h1>
					<p className='mt-2 text-slate-500'>Upcoming events based on your interests.</p>
				</div>

				<Link href='/preferences' className='rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50'>
					Manage Preferences
				</Link>
			</div>

			{loading ? (
				<p className='text-slate-500'>Loading your feed...</p>
			) : error ? (
				<p className='text-red-600'>{error}</p>
			) : events.length === 0 ? (
				<div className='rounded-xl border border-slate-200 p-8 text-center'>
					<p className='mb-4 text-slate-600'>No matching upcoming events found.</p>
					<Link href='/preferences' className='text-indigo-600 hover:underline'>
						Update your interests
					</Link>
				</div>
			) : (
				<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
					{events.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>
			)}
		</main>
	);
}
