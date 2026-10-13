'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { EventItem } from '@/types/event';

const backgrounds = [
	{
		id: 'default',
		name: 'Ocean Blue',
		className: 'bg-gradient-to-br from-blue-500 to-indigo-700',
	},
	{
		id: 'theme2',
		name: 'Sunset',
		className: 'bg-gradient-to-br from-orange-400 to-pink-600',
	},
	{
		id: 'theme3',
		name: 'Emerald',
		className: 'bg-gradient-to-br from-emerald-400 to-teal-700',
	},
] as const;

type BackgroundId = (typeof backgrounds)[number]['id'];

export default function CardDesignerPage() {
	const params = useParams<{ id: string }>();

	const [background, setBackground] = useState<BackgroundId>('default');
	const [stickers, setStickers] = useState<string[]>([]);
	const [event, setEvent] = useState<EventItem | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');

	const selectedBackground = backgrounds.find((item) => item.id === background)!;

	const availableStickers = [
		{ id: 'star', emoji: '⭐', name: 'Star' },
		{ id: 'heart', emoji: '❤️', name: 'Heart' },
		{ id: 'gift', emoji: '🎁', name: 'Gift' },
		{ id: 'balloon', emoji: '🎈', name: 'Balloon' },
		{ id: 'sparkle', emoji: '✨', name: 'Sparkle' },
	];

	function toggleSticker(id: string) {
		setStickers((previous) => {
			if (previous.includes(id)) {
				return previous.filter((item) => item !== id);
			}

			if (previous.length >= 3) return previous;

			return [...previous, id];
		});
	}

	useEffect(() => {
		async function loadCardDesign() {
			try {
				const [eventRes, designRes] = await Promise.all([fetch(`/api/events/${params.id}`), fetch(`/api/events/${params.id}/card-design`)]);

				if (!eventRes.ok || !designRes.ok) {
					throw new Error('Failed to load card designer');
				}

				const [eventData, designData] = await Promise.all([eventRes.json(), designRes.json()]);

				setEvent(eventData.data);
				setBackground(designData.data.background);
				setStickers(designData.data.stickers);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'Something went wrong');
			} finally {
				setLoading(false);
			}
		}

		loadCardDesign();
	}, [params.id]);

	async function saveCardDesign() {
		try {
			setSaving(true);
			setError('');
			setMessage('');

			const response = await fetch(`/api/events/${params.id}/card-design`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					background,
					stickers,
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to save card design');
			}

			setMessage('Card design saved successfully!');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return <p className='p-10 text-center'>Loading card designer...</p>;
	}

	if (error && !event) {
		return <p className='p-10 text-center text-red-600'>{error}</p>;
	}

	return (
		<main className='min-h-screen bg-slate-50 px-5 py-10'>
			<div className='mx-auto max-w-6xl'>
				<Link href={`/events/${params.id}`} className='text-sm font-medium text-indigo-600 hover:underline'>
					← Back to Event
				</Link>

				<div className='my-8'>
					<h1 className='text-3xl font-bold'>Customize Event Card</h1>
					<p className='mt-2 text-slate-500'>Choose a background and personalize your event card.</p>
				</div>

				<div className='grid gap-8 lg:grid-cols-2'>
					{/* Card preview */}
					<section className='rounded-2xl border border-slate-200 bg-white p-6'>
						<h2 className='mb-5 text-lg font-semibold'>Live Preview</h2>

						<div
							className={`flex relative aspect-4/3 flex-col justify-end overflow-hidden rounded-2xl p-7 text-white shadow-lg transition-all duration-500 ${selectedBackground.className}`}>
							<p className='text-sm opacity-80'>FYERX EVENT</p>

							<h3 className='mt-3 text-3xl font-bold'>{event?.title || 'Your Event'}</h3>

							<p className='mt-2 text-sm opacity-90'>
								{event?.city} • {event?.eventDate && new Date(event.eventDate).toLocaleDateString('en-IN')}
							</p>

							<div className='absolute right-5 top-5 flex gap-2'>
								{stickers.map((id) => {
									const sticker = availableStickers.find((item) => item.id === id);

									return (
										<span key={id} className='animate-bounce text-3xl'>
											{sticker?.emoji}
										</span>
									);
								})}
							</div>
						</div>
					</section>

					{/* Customization controls */}
					<section className='rounded-2xl border border-slate-200 bg-white p-6'>
						<h2 className='text-lg font-semibold'>Backgrounds</h2>

						<p className='mt-2 text-sm text-slate-500'>Select one of three backgrounds.</p>

						<div className='mt-6 grid grid-cols-3 gap-3'>
							{backgrounds.map((item) => (
								<button
									key={item.id}
									type='button'
									onClick={() => setBackground(item.id)}
									aria-pressed={background === item.id}
									className={`rounded-xl border-2 p-2 transition ${background === item.id ? 'border-indigo-600' : 'border-transparent'}`}>
									<div className={`aspect-square rounded-lg ${item.className}`} />

									<p className='mt-2 text-xs font-medium'>{item.name}</p>
								</button>
							))}
						</div>
						<div className='mt-8'>
							<h2 className='text-lg font-semibold'>Stickers ({stickers.length}/3)</h2>

							<div className='mt-4 grid grid-cols-5 gap-2'>
								{availableStickers.map((sticker) => (
									<button
										key={sticker.id}
										type='button'
										onClick={() => toggleSticker(sticker.id)}
										aria-label={sticker.name}
										aria-pressed={stickers.includes(sticker.id)}
										className={`rounded-xl border-2 p-3 text-2xl transition ${
											stickers.includes(sticker.id) ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200'
										}`}>
										{sticker.emoji}
									</button>
								))}
							</div>

							<button
								type='button'
								onClick={saveCardDesign}
								disabled={saving}
								className='mt-8 w-full rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50'>
								{saving ? 'Saving...' : 'Save Card Design'}
							</button>

							{message && (
								<p role='status' className='mt-3 text-sm text-green-600'>
									{message}
								</p>
							)}

							{error && (
								<p role='alert' className='mt-3 text-sm text-red-600'>
									{error}
								</p>
							)}
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
