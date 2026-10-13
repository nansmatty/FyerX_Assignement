'use client';

import { useMemo, useState } from 'react';
import EventCard, { EventItem } from './event-card';
import EventFilters from './event-filters';

type EventWithCategory = EventItem & {
	categoryId: string;
};

export default function EventsList({ events }: { events: EventWithCategory[] }) {
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [city, setCity] = useState('');

	const categories = [...new Set(events.map((event) => event.categoryId))];
	const cities = [...new Set(events.map((event) => event.city))];

	const filteredEvents = useMemo(() => {
		return events.filter((event) => {
			const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase().trim());

			const matchesCategory = !category || event.categoryId === category;
			const matchesCity = !city || event.city === city;

			return matchesSearch && matchesCategory && matchesCity;
		});
	}, [events, search, category, city]);

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
