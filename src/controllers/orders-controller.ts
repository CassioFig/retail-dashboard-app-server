import { Request, Response } from 'express';
import { database, DatabaseCollections } from '../database';
import { Order, User, Product } from '../models';

class OrdersController {
	async getItemsSoldByProduct(req: Request, res: Response) {
		try {
			const userId = req.headers['user-id'] as string;
			if (!userId) {
				return res.status(401).json({ message: 'Unauthorized: User ID is required' });
			}

			const user = await database.findById<User>(DatabaseCollections.USERS, userId);
			if (!user || !user.isAdmin) {
				return res.status(403).json({ message: 'Forbidden: Admin access required' });
			}

			const orders = await database.findAll<Order>(DatabaseCollections.ORDERS);
			
			const productSales: { [productId: string]: number } = {};
			
			orders.forEach(order => {
				order.items.forEach(item => {
					if (productSales[item.productId]) {
						productSales[item.productId] += item.quantity;
					} else {
						productSales[item.productId] = item.quantity;
					}
				});
			});

			const salesData = await Promise.all(
				Object.entries(productSales).map(async ([productId, quantitySold]) => {
					const product = await database.findById<Product>(DatabaseCollections.PRODUCTS, productId);
					return {
						productId,
						product: product || null,
						quantity: quantitySold,
					};
				})
			);

			const sortedSalesData = salesData.sort((a, b) => b.quantity - a.quantity);

			res.status(200).json(sortedSalesData);
		} catch (error) {
			console.error('Error fetching items sold by product:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export const ordersController = new OrdersController();
