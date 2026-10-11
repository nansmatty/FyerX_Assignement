import { pgTable, uuid, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { categories } from './categories';

export const userFavourites = pgTable(
	'user_favourites',
	{
		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
			}),
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categories.id, {
				onDelete: 'cascade',
			}),
	},
	(table) => [primaryKey({ columns: [table.userId, table.categoryId] })],
);
