import EventForm from '@/components/admin/event-form';

export default function CreateEventPage() {
	return (
		<main className='mx-auto max-w-3xl px-5 py-10'>
			<h1 className='mb-2 text-3xl font-bold'>Create Event</h1>
			<p className='mb-8 text-slate-500'>Add a new event to the platform.</p>

			<EventForm />
		</main>
	);
}
