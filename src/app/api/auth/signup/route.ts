import { apiHandler } from '@/lib/api-handler';
import { NextRequest } from 'next/server';
import { ApiError } from '@/lib/errors/api-error';
import { signupValidation } from '@/lib/validations/auth.validation';
import { db } from '@/db';
import { users } from '@/db/schemas';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/utils/password';

export async function POST(req: NextRequest) {
	return apiHandler(async () => {
		const body = await req.json();
		const validationRes = signupValidation.safeParse(body);

		if (!validationRes.success) {
			throw new ApiError(400, 'Validation failed');
		}

		const { name, email, password } = validationRes.data;

		const [existingUser] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);

		if (existingUser) {
			throw new ApiError(409, 'User already exists');
		}

		// Hash the password before storing it in the database
		const hashedPassword = await hashPassword(password);

		await db.insert(users).values({ name, email, password_hash: hashedPassword });

		return { message: 'Signup successful. Please login with same credentials.' };
	}, 201);
}
