'use client';

import { Category } from '@/types/category';
import { useEffect, useState } from 'react';

export default function CategoryPreferences() {
	const [categories, setCategories] = useState<Category[]>([]);
	const [selected, setSelected] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState('');

	useEffect(() => {
		async function loadPreferences() {
			try {
				const [categoriesRes, preferencesRes] = await Promise.all([fetch('/api/categories'), fetch('/api/me/preferences')]);

				if (!categoriesRes.ok || !preferencesRes.ok) {
					throw new Error('Failed to load preferences');
				}

				const [categoriesData, preferencesData] = await Promise.all([categoriesRes.json(), preferencesRes.json()]);

				setCategories(categoriesData.data);
				setSelected(preferencesData.data.map((item: { categoryId: string }) => item.categoryId));
			} catch (error) {
				setMessage(error instanceof Error ? error.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		}

		loadPreferences();
	}, []);

	function toggleCategory(id: string) {
		setSelected((previous) => (previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]));
		setMessage('');
	}

	async function savePreferences() {
		try {
			setSaving(true);
			setMessage('');

			const response = await fetch('/api/me/preferences', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ categoryIds: selected }),
			});

			if (!response.ok) {
				throw new Error('Failed to save preferences');
			}

			setMessage('Preferences saved successfully!');
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'Something went wrong');
		} finally {
			setSaving(false);
		}
	}

	if (loading) return <p>Loading preferences...</p>;

	return (
		<section className='rounded-2xl border border-slate-200 bg-white p-6'>
			<h2 className='text-xl font-semibold'>Your Interests</h2>
			<p className='mt-2 text-sm text-slate-500'>Select categories to personalize your event feed.</p>

			<div className='my-6 flex flex-wrap gap-3'>
				{categories.map((category) => {
					const isSelected = selected.includes(category.id);

					return (
						<button
							key={category.id}
							type='button'
							onClick={() => toggleCategory(category.id)}
							aria-pressed={isSelected}
							className={`rounded-full border px-4 py-2 text-sm transition ${
								isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
							}`}>
							{category.name}
						</button>
					);
				})}
			</div>

			<button
				type='button'
				onClick={savePreferences}
				disabled={saving}
				className='rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white disabled:opacity-50'>
				{saving ? 'Saving...' : 'Save Preferences'}
			</button>

			{message && (
				<p className='mt-4 text-sm' role='status'>
					{message}
				</p>
			)}
		</section>
	);
}
