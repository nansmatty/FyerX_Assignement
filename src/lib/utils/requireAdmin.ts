import { verifyToken } from './verifyToken';
import { ApiError } from '@/lib/errors/api-error';

export async function requireAdmin() {
	const user = await verifyToken();

	if (user.role !== 'ADMIN') {
		throw new ApiError(403, 'Admin access required');
	}

	return user;
}
