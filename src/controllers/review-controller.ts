import { Request, Response } from 'express';
import cuid from 'cuid';
import { database, DatabaseCollections } from '../database';
import { Review } from '../models/review';
import { Product } from '../models';

class ReviewController {
	async addReview(req: Request, res: Response) {
		try {
			const userId = req.headers['user-id'] as string;
			if (!userId) {
				return res.status(401).json({ message: 'Unauthorized: User ID is required' });
			}

			const { productId, rating, comment } = req.body as Omit<Review, 'id' | 'userId' | 'createdAt'>;

			if (!productId || !rating) {
				return res.status(400).json({ message: 'Product ID and rating are required' });
			}

			if (rating < 1 || rating > 5) {
				return res.status(400).json({ message: 'Rating must be between 1 and 5' });
			}

			const review = await database.create<Review>(DatabaseCollections.REVIEWS, {
				id: cuid(),
				userId,
				productId,
				rating,
				comment: comment || '',
				createdAt: new Date()
			});

			const product = await database.findById<Product>(DatabaseCollections.PRODUCTS, productId);
			if (product) {
				const reviews = await database.findBy<Review>(DatabaseCollections.REVIEWS, (r) => r.productId === productId);
				const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
				await database.update<Product>(DatabaseCollections.PRODUCTS, productId, { rating: { average: averageRating, count: reviews.length } });
			}

			res.status(201).json(review);
		} catch (error) {
			console.error('Error adding review:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async getReviewsByProduct(req: Request, res: Response) {
		try {
			const productId = req.params.productId;
			if (!productId) {
				return res.status(400).json({ message: 'Product ID is required' });
			}

			const reviews = await database.findBy<Review>(DatabaseCollections.REVIEWS, (review) => review.productId === productId);
			let reviewsWithUserDetails = await Promise.all(
				reviews.map(async review => ({
					...review,
					user: await database.findById(DatabaseCollections.USERS, review.userId)
				}))
			);

			res.status(200).json(reviewsWithUserDetails);
		} catch (error) {
			console.error('Error fetching reviews:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export const reviewController = new ReviewController();
