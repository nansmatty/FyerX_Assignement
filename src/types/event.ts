export type EventItem = {
	id: string;
	title: string;
	description: string | null;
	eventDate: string;
	city: string;
	price: number | string;
	categoryId: string;
	isActive: boolean;
	venue: string;
	imageUrl: string | null;
};
