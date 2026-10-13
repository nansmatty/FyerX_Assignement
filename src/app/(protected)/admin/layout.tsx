import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/utils/verifyToken';
import type { ReactNode } from 'react';

export default async function AdminLayout({ children }: { children: ReactNode }) {
	const user = await verifyToken();

	if (user.role !== 'ADMIN') {
		redirect('/');
	}

	return <>{children}</>;
}
