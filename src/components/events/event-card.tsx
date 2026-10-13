import type { EventItem, CardDesign } from '@/types/event';
import Link from 'next/link';

type EventCardProps = {
	event: EventItem & {
		cardDesign?: CardDesign | null;
	};
};

const backgrounds = {
	default: 'bg-gradient-to-br from-blue-500 to-indigo-700',
	theme2: 'bg-gradient-to-br from-orange-400 to-pink-600',
	theme3: 'bg-gradient-to-br from-emerald-400 to-teal-700',
};

const stickers: Record<string, string> = {
	star: '⭐',
	heart: '❤️',
	gift: '🎁',
	balloon: '🎈',
	sparkle: '✨',
};

export default function EventCard({ event }: EventCardProps) {
	const design = event.cardDesign;

	const backgroundClass = design ? (backgrounds[design.background] ?? backgrounds.default) : 'bg-white';

	return (
		<Link
			href={`/events/${event.id}`}
			className={`relative block overflow-hidden rounded-xl border border-slate-200 p-5 shadow-sm transition hover:shadow-md ${
				backgroundClass
			} ${design ? 'text-white' : 'text-slate-900'}`}>
			{design && design.stickers.length > 0 && (
				<div className='mb-4 flex justify-end gap-2'>
					{design.stickers.map((sticker) => (
						<span key={sticker} className='inline-block animate-bounce text-2xl'>
							{stickers[sticker]}
						</span>
					))}
				</div>
			)}

			<p className={`mb-2 text-sm ${design ? 'text-white/85' : 'text-indigo-600'}`}>
				{new Date(event.eventDate).toLocaleDateString('en-IN', {
					day: 'numeric',
					month: 'short',
					year: 'numeric',
				})}
			</p>

			<h2 className='mb-2 text-xl font-semibold'>{event.title}</h2>

			<p className={`mb-4 line-clamp-2 text-sm ${design ? 'text-white/90' : 'text-slate-600'}`}>{event.description}</p>

			<div className='flex items-center justify-between gap-3 text-sm'>
				<span>📍 {event.city}</span>
				<span className='font-semibold'>₹{event.price}</span>
			</div>
		</Link>
	);
}
