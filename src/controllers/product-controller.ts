import { Request, Response } from 'express';
import { database, DatabaseCollections } from '../database';
import { Product, User } from '../models';

class ProductController {
	async getProducts(req: Request, res: Response) {
		try {
			const products = (await database
				.findAll<Product>(DatabaseCollections.PRODUCTS))
				.filter(product => product.stock > 0);
			res.status(200).json(products);
		} catch (error) {
			console.error('Error fetching products:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async addProductToStock(req: Request, res: Response) {
		try {
			const userId = req.headers['user-id'] as string;
			if (!userId) {
				return res.status(401).json({ message: 'Unauthorized: User ID is required' });
			}

			const user = await database.findById<User>(DatabaseCollections.USERS, userId);
			if (!user || !user.isAdmin) {
				return res.status(403).json({ message: 'Forbidden: Only admins can add products in stock' });
			}

			const { id: productId, stock } = req.body as Pick<Product, 'stock' | 'id'>;
			if (!productId || stock === undefined) {
				return res.status(400).json({ message: 'Product ID and stock are required' });
			}
			const product = await database.findById<Product>(DatabaseCollections.PRODUCTS, productId);
			if (!product) {
				return res.status(404).json({ message: 'Product not found' });
			}

			product.stock += stock;
			await database.update<Product>(DatabaseCollections.PRODUCTS, productId, product);
			res.status(200).json({ message: 'Product stock updated successfully', product });
		} catch (error) {
			console.error('Error updating product stock:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export const productController = new ProductController();