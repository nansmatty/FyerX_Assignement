'use client';

import { useEffect, useMemo, useState } from 'react';
import EventCard, { EventItem } from './event-card';
import EventFilters from './event-filters';

type EventWithCategory = EventItem & {
	categoryId: string;
};

type Category = {
	id: string;
	name: string;
};

export default function EventsList() {
	const [events, setEvents] = useState<EventWithCategory[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [city, setCity] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

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

	const cities = [...new Set(events.map((event) => event.city))];

	const filteredEvents = useMemo(() => {
		return events.filter((event) => {
			const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase().trim());

			const matchesCategory = !category || event.categoryId === category;
			const matchesCity = !city || event.city === city;

			return matchesSearch && matchesCategory && matchesCity;
		});
	}, [events, search, category, city]);

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
				<div className='grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
					{filteredEvents.map((event) => (
						<EventCard key={event.id} event={event} />
					))}
				</div>
			)}
		</>
	);
}
