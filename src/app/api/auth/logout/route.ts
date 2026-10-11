import { cookies } from 'next/headers';
import { apiHandler } from '@/lib/api-handler';

export async function POST() {
	return apiHandler(async () => {
		const cookieStore = await cookies();

		cookieStore.delete('auth_token');

		return { message: 'Logged out successfully' };
	});
}
