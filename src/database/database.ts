import fs from 'fs/promises';
import path from 'path';

export enum DatabaseCollections {
	USERS = 'users',
	PRODUCTS = 'products',
	ORDERS = 'orders',
	CART = 'cart',
}

export class JsonDatabase {
  private dbPath: string;

  constructor(dbPath: string = './data') {
    this.dbPath = dbPath;
  }

  private async ensureDbDirectory(): Promise<void> {
    try {
      await fs.access(this.dbPath);
    } catch {
      await fs.mkdir(this.dbPath, { recursive: true });
    }
  }

  private getFilePath(collection: DatabaseCollections): string {
    return path.join(this.dbPath, `${collection}.json`);
  }

  private async readCollection<T>(collection: DatabaseCollections): Promise<T[]> {
    try {
      const filePath = this.getFilePath(collection);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) || [];
    } catch {
      return [];
    }
  }

  private async writeCollection<T>(collection: DatabaseCollections, data: T[]): Promise<void> {
    await this.ensureDbDirectory();
    const filePath = this.getFilePath(collection);
    console.log(`Writing to ${filePath}`);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }

  async findAll<T>(collection: DatabaseCollections): Promise<T[]> {
    return await this.readCollection<T>(collection);
  }

  async findById<T extends { id: string }>(collection: DatabaseCollections, id: string): Promise<T | null> {
    const data = await this.readCollection<T>(collection);
    return data.find(item => item.id === id) || null;
  }

  async create<T extends { id: string }>(collection: DatabaseCollections, item: T): Promise<T> {
    const data = await this.readCollection<T>(collection);
    data.push(item);
    await this.writeCollection(collection, data);
    return item;
  }

  async update<T extends { id: string }>(collection: DatabaseCollections, id: string, updatedItem: Partial<T>): Promise<T | null> {
    const data = await this.readCollection<T>(collection);
    const index = data.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updatedItem };
    await this.writeCollection(collection, data);
    return data[index];
  }

  async delete<T extends { id: string }>(collection: DatabaseCollections, id: string): Promise<boolean> {
    const data = await this.readCollection<T>(collection);
    const initialLength = data.length;
    const filteredData = data.filter(item => item.id !== id);
    
    if (filteredData.length === initialLength) return false;
    
    await this.writeCollection(collection, filteredData);
    return true;
  }

  async findBy<T>(collection: DatabaseCollections, predicate: (item: T) => boolean): Promise<T[]> {
    const data = await this.readCollection<T>(collection);
    return data.filter(predicate);
  }

  async count(collection: DatabaseCollections): Promise<number> {
    const data = await this.readCollection(collection);
    return data.length;
  }

  async clear(collection: DatabaseCollections): Promise<void> {
    await this.writeCollection(collection, []);
  }
}

export const database = new JsonDatabase();