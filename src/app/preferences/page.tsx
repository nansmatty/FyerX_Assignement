import CategoryPreferences from '@/components/preferences/category-preferences';

export default function PreferencesPage() {
	return (
		<main className='mx-auto max-w-5xl px-5 py-10'>
			<h1 className='mb-6 text-3xl font-bold'>Preferences & Reminders</h1>

			<CategoryPreferences />
		</main>
	);
}
