'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const AuthForm = () => {
	const router = useRouter();
	const [isSignup, setIsSignup] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [form, setForm] = useState({
		name: '',
		email: '',
		password: '',
	});

	async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		event.preventDefault();

		setLoading(true);
		setError('');

		try {
			const endpoint = isSignup ? '/api/auth/signup' : '/api/auth/signin';
			const payload = isSignup ? form : { email: form.email, password: form.password };

			const response = await fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) {
				const data = await response.json().catch(() => null);
				throw new Error(data?.message || 'Authentication failed');
			}

			if (isSignup) {
				setIsSignup(false);
				setForm((prev) => ({
					...prev,
					name: '',
					email: '',
					password: '',
				}));

				setError('');
				return;
			}

			router.push('/');
			router.refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Something went wrong');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className='w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm'>
			<h1 className='mb-2 text-center text-3xl font-bold'>{isSignup ? 'Create an account' : 'Welcome back'}</h1>

			<p className='mb-8 text-center text-sm text-slate-500'>
				{isSignup ? "Sign up to discover events you'll love." : 'Sign in to explore upcoming events.'}
			</p>

			<form onSubmit={handleSubmit} className='space-y-4'>
				{isSignup && (
					<div>
						<label htmlFor='name' className='mb-1 block text-sm font-medium'>
							Name
						</label>
						<input
							id='name'
							required
							className='w-full rounded-lg border p-3'
							placeholder='Your name'
							value={form.name}
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>
					</div>
				)}

				<div>
					<label htmlFor='email' className='mb-1 block text-sm font-medium'>
						Email
					</label>
					<input
						id='email'
						type='email'
						required
						className='w-full rounded-lg border p-3'
						placeholder='you@example.com'
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
					/>
				</div>

				<div>
					<label htmlFor='password' className='mb-1 block text-sm font-medium'>
						Password
					</label>
					<input
						id='password'
						type='password'
						required
						className='w-full rounded-lg border p-3'
						placeholder='Enter password'
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
					/>
				</div>

				{error && (
					<p role='alert' className='text-red-500 text-sm'>
						{error}
					</p>
				)}

				<button
					type='submit'
					disabled={loading}
					className='w-full rounded-lg bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50'>
					{loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Sign In'}
				</button>
			</form>

			<p className='mt-6 text-center text-sm text-slate-600'>
				{isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
				<button
					type='button'
					className='font-semibold text-indigo-600 hover:underline'
					onClick={() => {
						setIsSignup(!isSignup);
						setError('');
					}}>
					{isSignup ? 'Sign In' : 'Sign Up'}
				</button>
			</p>
		</div>
	);
};

export default AuthForm;
