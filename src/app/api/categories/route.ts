import { db } from '@/db';
import { categories } from '@/db/schemas';
import { apiHandler } from '@/lib/api-handler';
import { asc } from 'drizzle-orm';

export async function GET() {
	return apiHandler(async () => {
		const allCategories = await db
			.select({
				id: categories.id,
				name: categories.name,
			})
			.from(categories)
			.orderBy(asc(categories.name));

		return allCategories;
	});
}
