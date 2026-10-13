'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const links = [
	{ name: 'Home', href: '/' },
	{ name: 'My Feed', href: '/feed' },
	{ name: 'Preferences', href: '/preferences' },
];

export default function Navbar() {
	const pathname = usePathname();
	const router = useRouter();

	const [user, setUser] = useState<{
		authenticated: boolean;
		role: string | null;
	} | null>(null);

	useEffect(() => {
		async function checkAuth() {
			try {
				const response = await fetch('/api/auth/me', {
					cache: 'no-store',
				});

				if (!response.ok) throw new Error('Auth check failed');

				setUser(await response.json());
			} catch {
				setUser({ authenticated: false, role: null });
			}
		}
		checkAuth();
	}, [pathname]);

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

					{user === null ? null : user.authenticated ? (
						<>
							{user.role === 'admin' && (
								<Link href='/admin' className='text-sm font-medium text-indigo-600'>
									Admin
								</Link>
							)}

							<button
								type='button'
								onClick={async () => {
									const response = await fetch('/api/auth/logout', {
										method: 'POST',
									});

									if (response.ok) {
										setUser({ authenticated: false, role: null });
										router.push('/');
										router.refresh();
									}
								}}
								className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white'>
								Logout
							</button>
						</>
					) : (
						<Link href='/login' className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white'>
							Login
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
}
