export interface ProductRating {
  average: number;
  count: number;
}

export class Product {
	id: string;
	name: string;
	description: string;
	price: number;
	stock: number;
	imgUrl: string;
	rating: ProductRating;
}