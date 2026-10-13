'use client';

import { useEffect, useState } from 'react';
import type { EventItem } from '@/types/event';

export default function AdminEventsTable() {
	const [events, setEvents] = useState<EventItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		async function fetchEvents() {
			try {
				const response = await fetch('/api/admin/events');

				if (!response.ok) {
					throw new Error('Failed to fetch events');
				}

				const { data } = await response.json();
				setEvents(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		}

		fetchEvents();
	}, []);

	if (loading) return <p>Loading events...</p>;
	if (error) return <p className='text-red-600'>{error}</p>;

	return (
		<div className='overflow-hidden rounded-2xl border border-slate-200 bg-white'>
			<div className='flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5'>
				<h2 className='text-xl font-semibold'>All Events ({events.length})</h2>

				<a href='/admin/events/new' className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
					+ Create Event
				</a>
			</div>

			<div className='overflow-x-auto'>
				<table className='w-full text-left text-sm'>
					<thead className='bg-slate-50 text-slate-600'>
						<tr>
							<th className='px-5 py-4'>Event</th>
							<th className='px-5 py-4'>City</th>
							<th className='px-5 py-4'>Date</th>
							<th className='px-5 py-4'>Price</th>
							<th className='px-5 py-4'>Status</th>
							<th className='px-5 py-4'>Action</th>
						</tr>
					</thead>

					<tbody className='divide-y divide-slate-100'>
						{events.map((event) => (
							<tr key={event.id} className='hover:bg-slate-50'>
								<td className='px-5 py-4 font-medium'>{event.title}</td>

								<td className='px-5 py-4'>{event.city}</td>

								<td className='px-5 py-4'>{new Date(event.eventDate).toLocaleDateString('en-IN')}</td>

								<td className='px-5 py-4'>₹{event.price}</td>

								<td className='px-5 py-4'>
									<span
										className={`rounded-full px-3 py-1 text-xs font-medium ${
											event.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
										}`}>
										{event.isActive ? 'Active' : 'Inactive'}
									</span>
								</td>

								<td className='px-5 py-4'>
									<a href={`/admin/events/${event.id}/edit`} className='font-medium text-indigo-600 hover:underline'>
										Edit
									</a>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				{events.length === 0 && <p className='p-6 text-center text-slate-500'>No events found.</p>}
			</div>
		</div>
	);
}
