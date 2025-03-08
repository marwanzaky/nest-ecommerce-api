export interface IProduct {
	_id: string;
	name: string;
	price: number;
	priceCompare: number;
	discount: string;
	avgRatings: number;
	numReviews: number;
	imgUrls: string[];
	description: string;
	createdAt: string;
}
