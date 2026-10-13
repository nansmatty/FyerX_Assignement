import EventsList from '@/components/events/events-list';

export default async function EventsPage() {
	return (
		<main className='mx-auto min-h-screen max-w-7xl px-5 py-10'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold'>Discover Events</h1>
				<p className='mt-2 text-slate-500'>Find upcoming events that interest you</p>
			</div>

			<EventsList />
		</main>
	);
}
