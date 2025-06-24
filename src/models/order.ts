export class Order {
	id: string;
	userId: string;
	items: OrderItem[];
	totalAmount: number;
}

export class OrderItem {
	productId: string;
	quantity: number;
	price: number;
}