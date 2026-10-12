import { db } from '@/db';
import { userFavourites } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { verifyToken } from '@/lib/utils/verifyToken';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	return apiHandler(async () => {
		const loggedUser = await verifyToken();

		const preferences = await db
			.select({ categoryId: userFavourites.categoryId })
			.from(userFavourites)
			.where(eq(userFavourites.userId, loggedUser.userId));

		return preferences;
	});
}
