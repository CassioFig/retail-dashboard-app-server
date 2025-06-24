import { Request, Response } from 'express';
import cuid from 'cuid';
import { Cart, CartItem, Product } from '../models';
import { database, DatabaseCollections } from '../database';

class CartController {
	async addToCart(req: Request, res: Response) {
		try {
			const userId = req.headers['user-id'] as string;
			if (!userId) {
				return res.status(401).json({ message: 'Unauthorized: User ID is required' });
			}

			let cart = (await database.findBy<Cart>(DatabaseCollections.CART, cart => cart.userId === userId))[0];
			if (!cart) {
				cart = await database.create<Cart>(DatabaseCollections.CART, {
					id: cuid(),
					userId,
					items: [],
					totalAmount: 0,
					totalItemCount: 0
				});
			}

			const { productId, quantity } = req.body as Omit<CartItem, 'price'>;
			const productStock = await database.findById<Product>(DatabaseCollections.PRODUCTS, productId);
			if (!productStock || productStock.stock === 0) {
				return res.status(400).json({ message: 'Product ID and quantity are required' });
			}

			const existingItemIndex = cart.items.findIndex(cartItem => cartItem.productId === productId);
			if (existingItemIndex !== -1) {
				cart.items[existingItemIndex].quantity += quantity;
			} else {
				cart.items.push({
					productId: productId,
					quantity: quantity,
					price: productStock.price
				});
			}

			cart.totalItemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
			cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);

			const updatedCart = await database.update<Cart>(DatabaseCollections.CART, cart.id, cart);
			productStock.stock -= quantity;
			await database.update<Product>(DatabaseCollections.PRODUCTS, productId, productStock);

			res.status(201).json(updatedCart);
		} catch (error) {
			console.error('Error adding to cart:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async getCart(req: Request, res: Response) {
		try {
			const userId = req.headers['user-id'] as string;
			if (!userId) {
				return res.status(401).json({ message: 'Unauthorized: User ID is required' });
			}

			let cart = (await database.findBy<Cart>(DatabaseCollections.CART, cart => cart.userId === userId))[0];
			if (!cart) {
				return res.status(404).json({ message: 'Cart not found' });
			}

			cart.items = await Promise.all(
				cart.items.map(async item => {
					const product = await database.findById<Product>(DatabaseCollections.PRODUCTS, item.productId);
					return product ? {
						...item,
						product
					} : { ...item, product: {} }
				})
			)

			res.status(200).json(cart);
		} catch (error) {
			console.error('Error retrieving cart:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export const cartController = new CartController();