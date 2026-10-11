import { pgTable, uuid, varchar, jsonb, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { users } from './users';
import { events } from './events';

export const eventCardDesigns = pgTable(
	'event_card_designs',
	{
		id: uuid('id').primaryKey().defaultRandom(),

		userId: uuid('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade',
			}),
		eventId: uuid('event_id')
			.notNull()
			.references(() => events.id, {
				onDelete: 'cascade',
			}),

		background: varchar('background', { length: 30 }).notNull().default('default'),
		stickers: jsonb('stickers').$type<string[]>().notNull().default([]),

		updatedAt: timestamp('updated_at', { withTimezone: true })
			.notNull()
			.defaultNow()
			.$onUpdate(() => new Date()),
	},
	(table) => [uniqueIndex('card_design_user_event_idx').on(table.userId, table.eventId)],
);
