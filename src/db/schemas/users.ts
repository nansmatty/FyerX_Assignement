import { pgTable, uuid, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['ADMIN', 'USER']);

export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	password_hash: varchar('password_hash', { length: 255 }).notNull(),
	role: userRoleEnum('role').notNull().default('USER'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
});
