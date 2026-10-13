'use client';

import { useEffect, useMemo, useState } from 'react';
import EventCard from './event-card';
import EventFilters from './event-filters';
import { EventItem } from '@/types/event';
import { Category } from '@/types/category';

type EventWithCategory = EventItem & {
	categoryId: string;
};

export default function EventsList() {
	const [events, setEvents] = useState<EventWithCategory[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [city, setCity] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const eventsPerPage = 6;

	useEffect(() => {
		async function loadData() {
			try {
				const [eventsRes, categoriesRes] = await Promise.all([fetch('/api/events'), fetch('/api/categories')]);

				if (!eventsRes.ok || !categoriesRes.ok) {
					throw new Error('Failed to load events or categories');
				}

				const [eventsData, categoriesData] = await Promise.all([eventsRes.json(), categoriesRes.json()]);

				setEvents(eventsData.data);
				setCategories(categoriesData.data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	useEffect(() => {
		setCurrentPage(1);
	}, [search, category, city]);

	const cities = [...new Set(events.map((event) => event.city))];

	const filteredEvents = useMemo(() => {
		return events.filter((event) => {
			const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase().trim());

			const matchesCategory = !category || event.categoryId === category;
			const matchesCity = !city || event.city === city;

			return matchesSearch && matchesCategory && matchesCity;
		});
	}, [events, search, category, city]);

	const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

	const paginatedEvents = filteredEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

	if (loading) return <p>Loading events...</p>;
	if (error) return <p className='text-error-600'>{error}</p>;

	return (
		<>
			<EventFilters
				search={search}
				category={category}
				city={city}
				categories={categories}
				cities={cities}
				onSearchChange={setSearch}
				onCategoryChange={setCategory}
				onCityChange={setCity}
			/>

			<p className='mb-4 text-sm text-slate-500'>{filteredEvents.length} events found</p>

			{filteredEvents.length === 0 ? (
				<p className='text-sm text-slate-500'>No events found</p>
			) : (
				<>
					<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
						{paginatedEvents.map((event) => (
							<EventCard key={event.id} event={event} />
						))}
					</div>
					<div>
						{totalPages > 1 && (
							<div className='mt-8 flex items-center justify-center gap-4'>
								<button
									type='button'
									disabled={currentPage === 1}
									onClick={() => setCurrentPage((page) => page - 1)}
									className='rounded-lg border px-4 py-2 disabled:opacity-40'>
									Previous
								</button>

								<span className='text-sm text-slate-600'>
									Page {currentPage} of {totalPages}
								</span>

								<button
									type='button'
									disabled={currentPage === totalPages}
									onClick={() => setCurrentPage((page) => page + 1)}
									className='rounded-lg border px-4 py-2 disabled:opacity-40'>
									Next
								</button>
							</div>
						)}
					</div>
				</>
			)}
		</>
	);
}
