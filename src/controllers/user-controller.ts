import { database, DatabaseCollections } from "../database";
import { Request, Response } from 'express';
import { User } from "../models";
import cuid from 'cuid';

class UserController {
	async signUp(req: Request, res: Response) {
		try {
			const body = req.body as User;
			const existingUser = await database.findBy<User>(DatabaseCollections.USERS, user => user.email === body.email);
			if (existingUser.length > 0) {
				return res.status(400).json({ message: 'User with this email already exists' });
			}

			const user = await database.create(DatabaseCollections.USERS, { ...body, id: cuid() });
			const { password, ...userWithouPassword } = user;
			res.status(201).json(userWithouPassword);
		} catch (error) {
			console.error('Error signing up user:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}

	async login(req: Request, res: Response) {
		try {
			const { email, password } = req.body as { email: string; password: string };
			const user = await database.findBy<User>(DatabaseCollections.USERS, user => user.email === email && user.password === password);

			if (user.length === 0) {
				return res.status(401).json({ message: 'Invalid email or password' });
			}

			const { password: _, ...userWithoutPassword } = user[0];
			res.status(200).json(userWithoutPassword);
		} catch (error) {
			console.error('Error logging in user:', error);
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export const userController = new UserController();