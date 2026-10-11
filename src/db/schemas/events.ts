import { pgTable, uuid, varchar, text, timestamp, numeric, boolean, index } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { users } from './users';

export const events = pgTable(
	'events',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		title: varchar('title', { length: 255 }).notNull(),
		description: text('description').notNull(),
		categoryId: uuid('category_id')
			.notNull()
			.references(() => categories.id),
		city: varchar('city', { length: 255 }).notNull(),
		venue: varchar('venue', { length: 255 }).notNull(),
		eventDate: timestamp('event_date', { withTimezone: true }).notNull(),
		price: numeric('price', { precision: 10, scale: 2 }).notNull(),
		imageUrl: varchar('image_url'),
		isActive: boolean('is_active').notNull().default(true),
		createdBy: uuid('created_by')
			.notNull()
			.references(() => users.id),
		createdAt: timestamp('created_at').notNull().defaultNow(),
		updatedAt: timestamp('updated_at')
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [
		index('idx_events_category_id').on(table.categoryId),
		index('idx_events_city').on(table.city),
		index('idx_events_event_date').on(table.eventDate),
	],
);
