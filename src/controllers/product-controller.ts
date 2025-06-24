import { Request, Response } from 'express';
import { database, DatabaseCollections } from '../database';
import { Product } from '../models';

class ProductController {
	async getProducts(req: Request, res: Response) {
		try {
			const products = await database.findAll<Product>(DatabaseCollections.PRODUCTS);
			res.status(200).json(products);
		} catch (error) {
			console.error('Error fetching products:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export const productController = new ProductController();