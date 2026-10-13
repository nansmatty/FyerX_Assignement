import Link from 'next/link';

export type EventItem = {
	id: string;
	title: string;
	description: string | null;
	eventDate: string;
	city: string;
	price: number | string;
};

export default function EventCard({ event }: { event: EventItem }) {
	return (
		<Link href={`/events/${event.id}`} className='black rounded-xl border border-slate-200 bg-white p-5 transition hover:shadow-md'>
			<p className='mb-2 text-sm text-indigo-600'>
				{new Date(event.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
			</p>

			<h2 className='mb-2 text-xl font-semibold'>{event.title}</h2>

			<p className='mb-4 line-clamp-2 text-sm text-slate-600'>{event.description}</p>

			<div className='flex items-center justify-between text-sm'>
				<span>📍 {event.city}</span>
				<span className='font-semibold'>₹{event.price}</span>
			</div>
		</Link>
	);
}
