'use client';

import { type SubmitEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Category = {
	id: string;
	name: string;
};

type EventFormValues = {
	title: string;
	description: string;
	categoryId: string;
	city: string;
	venue: string;
	eventDate: string;
	price: string;
	imageUrl: string;
	isActive: boolean;
};

type EventFormProps = {
	eventId?: string;
	initialValues?: EventFormValues;
};

const emptyForm: EventFormValues = {
	title: '',
	description: '',
	categoryId: '',
	city: '',
	venue: '',
	eventDate: '',
	price: '',
	imageUrl: '',
	isActive: true,
};

export default function EventForm({ eventId, initialValues }: EventFormProps) {
	const router = useRouter();
	const isEditing = Boolean(eventId);

	const [form, setForm] = useState<EventFormValues>(initialValues ?? emptyForm);
	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		async function loadCategories() {
			try {
				const response = await fetch('/api/categories');

				if (!response.ok) {
					throw new Error('Failed to load categories');
				}

				const { data } = await response.json();
				setCategories(data);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Something went wrong');
			}
		}

		loadCategories();
	}, []);

	function updateField<K extends keyof EventFormValues>(field: K, value: EventFormValues[K]) {
		setForm((prev) => ({ ...prev, [field]: value }));
	}

	async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const price = Number(form.price);

			if (!form.price.trim() || !Number.isFinite(price) || price < 0 || !Number.isInteger(Math.round(price * 100))) {
				throw new Error('Enter a valid price with up to 2 decimals');
			}

			const eventDate = new Date(form.eventDate);

			if (Number.isNaN(eventDate.getTime())) {
				throw new Error('Enter a valid event date');
			}

			const payload = {
				title: form.title.trim(),
				description: form.description.trim(),
				categoryId: form.categoryId,
				city: form.city.trim(),
				venue: form.venue.trim(),
				eventDate: eventDate.toISOString(),
				price,
				...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
				isActive: form.isActive,
			};

			const response = await fetch(isEditing ? `/api/admin/events/${eventId}` : '/api/admin/events', {
				method: isEditing ? 'PATCH' : 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const result = await response.json().catch(() => null);
				throw new Error(result?.message || 'Failed to save event');
			}

			router.push('/admin');
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
		} finally {
			setLoading(false);
		}
	}

	const inputClass = 'w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500';

	return (
		<form onSubmit={handleSubmit} className='space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
			<div>
				<label htmlFor='title' className='mb-2 block text-sm font-medium'>
					Event Title
				</label>
				<input id='title' required maxLength={255} value={form.title} onChange={(e) => updateField('title', e.target.value)} className={inputClass} />
			</div>

			<div>
				<label htmlFor='description' className='mb-2 block text-sm font-medium'>
					Description
				</label>
				<textarea
					id='description'
					required
					rows={4}
					value={form.description}
					onChange={(e) => updateField('description', e.target.value)}
					className={inputClass}
				/>
			</div>

			<div>
				<label htmlFor='category' className='mb-2 block text-sm font-medium'>
					Category
				</label>
				<select id='category' required value={form.categoryId} onChange={(e) => updateField('categoryId', e.target.value)} className={inputClass}>
					<option value=''>Select category</option>
					{categories.map((category) => (
						<option key={category.id} value={category.id}>
							{category.name}
						</option>
					))}
				</select>
			</div>

			<div className='grid gap-5 sm:grid-cols-2'>
				<div>
					<label htmlFor='city' className='mb-2 block text-sm font-medium'>
						City
					</label>
					<input id='city' required maxLength={255} value={form.city} onChange={(e) => updateField('city', e.target.value)} className={inputClass} />
				</div>

				<div>
					<label htmlFor='venue' className='mb-2 block text-sm font-medium'>
						Venue
					</label>
					<input
						id='venue'
						required
						maxLength={255}
						value={form.venue}
						onChange={(e) => updateField('venue', e.target.value)}
						className={inputClass}
					/>
				</div>
			</div>

			<div className='grid gap-5 sm:grid-cols-2'>
				<div>
					<label htmlFor='eventDate' className='mb-2 block text-sm font-medium'>
						Event Date & Time
					</label>
					<input
						id='eventDate'
						type='datetime-local'
						required
						value={form.eventDate}
						onChange={(e) => updateField('eventDate', e.target.value)}
						className={inputClass}
					/>
				</div>

				<div>
					<label htmlFor='price' className='mb-2 block text-sm font-medium'>
						Price (₹)
					</label>
					<input
						id='price'
						type='number'
						min='0'
						step='0.01'
						required
						value={form.price}
						onChange={(e) => updateField('price', e.target.value)}
						className={inputClass}
					/>
				</div>
			</div>

			<div>
				<label htmlFor='imageUrl' className='mb-2 block text-sm font-medium'>
					Image URL (optional)
				</label>
				<input id='imageUrl' type='url' value={form.imageUrl} onChange={(e) => updateField('imageUrl', e.target.value)} className={inputClass} />
			</div>

			<label className='flex items-center gap-3 text-sm font-medium'>
				<input
					type='checkbox'
					checked={form.isActive}
					onChange={(e) => updateField('isActive', e.target.checked)}
					className='size-4 accent-indigo-600'
				/>
				Active Event
			</label>

			{error && (
				<p role='alert' className='text-sm text-red-600'>
					{error}
				</p>
			)}

			<button
				type='submit'
				disabled={loading}
				className='w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:opacity-50'>
				{loading ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
			</button>
		</form>
	);
}
