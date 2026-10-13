'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
	{ name: 'Home', href: '/' },
	{ name: 'My Feed', href: '/feed' },
	{ name: 'Preferences', href: '/preferences' },
];

export default function Navbar() {
	const pathname = usePathname();

	return (
		<header className='border-b border-slate-200 bg-white'>
			<nav className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4'>
				<Link href='/' className='text-2xl font-bold text-indigo-600'>
					FyerX
				</Link>

				<div className='flex flex-wrap items-center gap-5'>
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
							className={`text-sm font-medium transition ${pathname === link.href ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}>
							{link.name}
						</Link>
					))}

					<Link href='/login' className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700'>
						Login
					</Link>
				</div>
			</nav>
		</header>
	);
}
