import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { users } from './schemas/users';
import { categories } from './schemas/categories';
import { events } from './schemas/events';

config({ path: '.env' });

async function seed() {
	const categoryNames = ['Music', 'Workshop', 'Food', 'Sports', 'Kids'];

	// 1. Seed categories
	await db
		.insert(categories)
		.values(categoryNames.map((name) => ({ name })))
		.onConflictDoNothing();

	const savedCategories = await db.select().from(categories);

	const categoryMap = new Map(savedCategories.map((category) => [category.name, category.id]));

	const categoryId = (name: string) => {
		const id = categoryMap.get(name);
		if (!id) throw new Error(`Category not found: ${name}`);
		return id;
	};

	// 2. Seed admin
	const adminEmail = process.env.SEED_ADMIN_EMAIL;
	const adminPassword = process.env.SEED_ADMIN_PASSWORD;

	if (!adminEmail || !adminPassword) {
		throw new Error('Admin seed credentials are missing');
	}

	const passwordHash = await bcrypt.hash(adminPassword, 12);

	await db
		.insert(users)
		.values({
			name: 'FyerX Admin',
			email: adminEmail,
			password_hash: passwordHash,
			role: 'ADMIN',
		})
		.onConflictDoNothing();

	const [admin] = await db.select({ id: users.id }).from(users).where(eq(users.email, adminEmail)).limit(1);

	if (!admin) throw new Error('Admin account not found');

	// 3. Seed events
	const sampleEvents = [
		{ title: 'Mumbai Indie Music Night', category: 'Music', city: 'Mumbai', venue: 'Bandra Amphitheatre', days: 5, price: '499.00', active: true },
		{ title: 'React and Next.js Workshop', category: 'Workshop', city: 'Pune', venue: 'Tech Hub Pune', days: 8, price: '999.00', active: true },
		{
			title: 'Delhi Street Food Festival',
			category: 'Food',
			city: 'Delhi',
			venue: 'Jawaharlal Nehru Stadium',
			days: 10,
			price: '199.00',
			active: true,
		},
		{ title: 'Bengaluru Marathon', category: 'Sports', city: 'Bengaluru', venue: 'Cubbon Park', days: 12, price: '750.00', active: true },
		{ title: 'Kids Science Fair', category: 'Kids', city: 'Mumbai', venue: 'Nehru Science Centre', days: 15, price: '0.00', active: true },
		{
			title: 'Coimbatore Music Night',
			category: 'Music',
			city: 'Coimbatore',
			venue: 'City Convention Hall',
			days: 18,
			price: '399.00',
			active: true,
		},
		{ title: 'Python for Beginners', category: 'Workshop', city: 'Hyderabad', venue: 'Innovation Centre', days: 20, price: '1499.00', active: true },
		{ title: 'Mumbai Food Carnival', category: 'Food', city: 'Mumbai', venue: 'Jio World Garden', days: 22, price: '299.00', active: true },
		{ title: 'Weekend Football Tournament', category: 'Sports', city: 'Chennai', venue: 'City Sports Ground', days: 25, price: '0.00', active: true },
		{ title: 'Kids Art and Craft Day', category: 'Kids', city: 'Pune', venue: 'Creative Arts Studio', days: 28, price: '250.00', active: true },
		{ title: 'Jazz Music Festival', category: 'Music', city: 'Delhi', venue: 'Central Auditorium', days: 30, price: '1200.00', active: true },
		{
			title: 'AI Application Development Workshop',
			category: 'Workshop',
			city: 'Bengaluru',
			venue: 'Developer Space',
			days: 33,
			price: '1999.00',
			active: true,
		},
		{ title: 'Hyderabad Biryani Festival', category: 'Food', city: 'Hyderabad', venue: 'Food Expo Hall', days: 35, price: '350.00', active: false },
		{ title: 'Mumbai Cycling Challenge', category: 'Sports', city: 'Mumbai', venue: 'Marine Drive', days: 38, price: '599.00', active: false },
		{
			title: "Children's Storytelling Festival",
			category: 'Kids',
			city: 'Kolkata',
			venue: 'Community Library',
			days: 40,
			price: '0.00',
			active: true,
		},
	];

	// Relative dates keep events upcoming on future seed runs.
	const eventDate = (days: number) => {
		const date = new Date();
		date.setUTCDate(date.getUTCDate() + days);
		date.setUTCHours(12, 30, 0, 0);
		return date;
	};

	// Prevent duplicate events on repeated seed runs.
	const existingEvents = await db.select({ title: events.title }).from(events);

	const existingTitles = new Set(existingEvents.map((event) => event.title));

	const newEvents = sampleEvents
		.filter((event) => !existingTitles.has(event.title))
		.map((event) => ({
			title: event.title,
			description: `Join us for ${event.title}, a community event in ${event.city}.`,
			categoryId: categoryId(event.category),
			city: event.city,
			venue: event.venue,
			eventDate: eventDate(event.days),
			price: event.price,
			imageUrl: `https://placehold.co/800x500?text=${encodeURIComponent(event.category)}`,
			isActive: event.active,
			createdBy: admin.id,
		}));

	if (newEvents.length > 0) {
		await db.insert(events).values(newEvents);
	}

	console.log('Database seed completed successfully');
}

seed().catch((error) => {
	console.error('Seed failed:', error);
	process.exitCode = 1;
});
