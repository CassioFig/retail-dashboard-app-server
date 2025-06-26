import { database, DatabaseCollections } from './database';
import { Product } from '../models/product';
import cuid from 'cuid';
import { User } from '../models';

export async function seedDatabase(): Promise<void> {
	const productsCount = await database.count(DatabaseCollections.PRODUCTS);

	if (productsCount > 0) {
		console.log('Banco de dados já possui dados iniciais.');
		return;
	}

	const getAverage = () => 0;
	const getCount = () => 0;
	
	const seedProducts: Product[] = [
		{
			id: cuid(),
			name: "Green Running Shoes",
			description: "Comfortable and stylish running shoes in green color.",
			price: 59.99,
			imgUrl: "http://localhost:4000/images/1.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 25,
		},
		{
			id: cuid(),
			name: "Red Athletic Sneakers",
			description: "High-performance athletic sneakers in vibrant red.",
			price: 79.99,
			imgUrl: "http://localhost:4000/images/2.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 10,
		},
		{
			id: cuid(),
			name: "Classic White Trainers",
			description: "Timeless white trainers perfect for everyday wear.",
			price: 69.99,
			imgUrl: "http://localhost:4000/images/3.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 120,
		},
		{
			id: cuid(),
			name: "Black Nike Shoes",
			description: "Sleek black Nike shoes for casual outings.",
			price: 89.99,
			imgUrl: "http://localhost:4000/images/4.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 75,
		},
		{
			id: cuid(),
			name: "Green Running Shoes",
			description: "High-performance running shoes with excellent grip.",
			price: 95.99,
			imgUrl: "http://localhost:4000/images/5.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 60,
		},
		{
			id: cuid(),
			name: "Black and Blue Sports Shoes",
			description: "Stylish black and blue sports shoes for all-day comfort.",
			price: 39.99,
			imgUrl: "http://localhost:4000/images/6.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 90,
		},
		{
			id: cuid(),
			name: "Casual Blue Sneakers",
			description: "Trendy blue sneakers for casual outings.",
			price: 129.99,
			imgUrl: "http://localhost:4000/images/7.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 45,
		},
		{
			id: cuid(),
			name: "White Basketball High Tops",
			description: "High-top basketball shoes designed for performance and style.",
			price: 109.99,
			imgUrl: "http://localhost:4000/images/8.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 55,
		},
		{
			id: cuid(),
			name: "Grey and Orange Running Shoes",
			description: "Lightweight running shoes for optimal performance.",
			price: 49.99,
			imgUrl: "http://localhost:4000/images/9.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 70,
		},
		{
			id: cuid(),
			name: "Classic Black Running Shoes",
			description: "Durable black running shoes for everyday training.",
			price: 149.99,
			imgUrl: "http://localhost:4000/images/10.webp",
			rating: {
				average: getAverage(),
				count: getCount(),
			},
			stock: 35,
		}
	];

	const seedUsers: User[] = [
		{
			id: cuid(),
			firstName: "Admin",
			lastName: "Root",
			email: "admin@example.com",
			password: "123",
			isAdmin: true,
		}
	];

	for (const product of seedProducts) {
		await database.create(DatabaseCollections.PRODUCTS, product);
	}

	for (const user of seedUsers) {
		await database.create(DatabaseCollections.USERS, user);
	}
	console.log('Dados iniciais inseridos com sucesso!');
}