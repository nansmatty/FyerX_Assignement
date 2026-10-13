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

export type CardDesign = {
	background: 'default' | 'theme2' | 'theme3';
	stickers: string[];
};

export interface FeedEvent extends EventItem {
	cardDesign: CardDesign | null;
}
