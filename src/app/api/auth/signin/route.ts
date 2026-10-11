import { db } from '@/db';
import { users } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { loginValidation } from '@/lib/validations/auth.validation';
import { NextRequest } from 'next/server';
import { eq } from 'drizzle-orm';
import { comparePassword } from '@/lib/utils/password';
import { generateToken } from '@/lib/utils/generateToken';
import { ApiError } from '@/lib/errors/api-error';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
	return apiHandler(async () => {
		const body = await req.json();
		const validationRes = loginValidation.safeParse(body);

		if (!validationRes.success) {
			throw new ApiError(400, 'Invalid credentials');
		}

		const { email, password } = validationRes.data;

		const [checkUser] = await db.select().from(users).where(eq(users.email, email)).limit(1);

		if (!checkUser) {
			throw new ApiError(401, 'Invalid credentials');
		}

		const passwordCheck = await comparePassword(password, checkUser.password_hash);

		if (!passwordCheck) {
			throw new ApiError(401, 'Invalid credentials');
		}

		const token = generateToken({ userId: checkUser.id, email: checkUser.email, role: checkUser.role });

		const cookieStore = await cookies();

		cookieStore.set('auth_token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
			path: '/',
			maxAge: 60 * 60,
		});

		return { message: 'Login successful' };
	});
}
