import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/utils/verifyToken';
import type { ReactNode } from 'react';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
	try {
		await verifyToken();
	} catch {
		redirect('/login');
	}

	return <>{children}</>;
}
