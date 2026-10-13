'use client';

import { Category } from '@/types/category';

type EventFiltersProps = {
	search: string;
	category: string;
	city: string;
	categories: Category[];
	cities: string[];
	onSearchChange: (search: string) => void;
	onCategoryChange: (category: string) => void;
	onCityChange: (city: string) => void;
};

export default function EventFilters({
	search,
	category,
	city,
	categories,
	cities,
	onSearchChange,
	onCategoryChange,
	onCityChange,
}: EventFiltersProps) {
	return (
		<div className='mb-8 grid gap-4 md:grid-cols-3'>
			<input
				type='search'
				placeholder='Search events...'
				value={search}
				onChange={(e) => onSearchChange(e.target.value)}
				className='rounded-lg border border-slate-300 p-3'
			/>
			<select value={category} onChange={(e) => onCategoryChange(e.target.value)} className='rounded-lg border border-slate-300 p-3'>
				<option value=''>All Categories</option>
				{categories.map((item) => (
					<option key={item.id} value={item.id}>
						{item.name}
					</option>
				))}
			</select>

			<select value={city} onChange={(e) => onCityChange(e.target.value)} className='rounded-lg border border-slate-300 p-3'>
				<option value=''>All Cities</option>
				{cities.map((item) => (
					<option key={item} value={item}>
						{item}
					</option>
				))}
			</select>
		</div>
	);
}
