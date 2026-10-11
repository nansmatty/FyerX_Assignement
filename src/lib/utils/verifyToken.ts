import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { ApiError } from '@/lib/errors/api-error';

interface AuthPayload extends JwtPayload {
	userId: string;
	email: string;
	role: 'ADMIN' | 'USER';
}

export async function verifyToken(): Promise<AuthPayload> {
	const cookieStore = await cookies();
	const token = cookieStore.get('auth_token')?.value;

	if (!token) {
		throw new ApiError(401, 'Authentication required');
	}

	try {
		const secret = process.env.JWT_SECRET;

		if (!secret) {
			throw new Error('JWT_SECRET is not configured');
		}

		const decoded = jwt.verify(token, secret, {
			algorithms: ['HS256'],
		});

		if (
			typeof decoded === 'string' ||
			typeof decoded.userId !== 'string' ||
			typeof decoded.email !== 'string' ||
			(decoded.role !== 'ADMIN' && decoded.role !== 'USER')
		) {
			throw new ApiError(401, 'Invalid token');
		}

		return decoded as AuthPayload;
	} catch (error) {
		if (error instanceof ApiError) throw error;

		if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
			throw new ApiError(401, 'Invalid or expired token');
		}

		throw error;
	}
}
