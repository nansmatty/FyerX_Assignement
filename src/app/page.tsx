import Link from 'next/link';
import EventsList from '@/components/events/events-list';

export default function Home() {
	return (
		<main className='mx-auto max-w-7xl px-5 py-10'>
			<section className='mb-12 rounded-2xl bg-indigo-600 px-8 py-14 text-white'>
				<h1 className='text-4xl font-bold'>Discover Events You'll Love</h1>

				<p className='mt-4 max-w-xl text-indigo-100'>Explore upcoming events, personalize your feed, and save reminders for your favourites.</p>

				<Link href='/feed' className='mt-6 inline-block rounded-lg bg-white px-5 py-3 font-medium text-indigo-600'>
					Explore My Feed
				</Link>
			</section>

			<h2 className='mb-6 text-2xl font-bold'>Upcoming Events</h2>

			<EventsList />
		</main>
	);
}
