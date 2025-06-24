export class Cart {
	userId: string;
	items: CartItem[];
	totalItemCount: number;
	totalAmount: number;
}

export class CartItem {
	productId: string;
	quantity: number;
	price: number;
}