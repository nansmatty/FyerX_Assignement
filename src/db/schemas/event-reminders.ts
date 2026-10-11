import { pgTable, uuid, timestamp, primaryKey } from 'drizzle-orm/pg-core';
import { users } from './users';
import { events } from './events';

export const eventReminders = pgTable(
	'event_reminders',
	{
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

		createdAt: timestamp('created_at').notNull().defaultNow(),
	},
	(table) => [primaryKey({ columns: [table.userId, table.eventId] })],
);
