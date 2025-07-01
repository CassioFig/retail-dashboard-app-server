import express from 'express';
import cors from 'cors';
import { User } from './models';
import { cartController, ordersController, productController, reviewController, userController } from './controllers';
import { seedDatabase } from './database/seed';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

app.get('/', (req, res) => {
  res.json({ message: 'Retail Dashboard Server is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Authentication
app.post('/auth/signup', async (req, res) => {
  await userController.signUp(req, res);
});

app.post('/auth/signin', async (req, res) => {
  await userController.login(req, res);
});

// Products
app.get('/products', async (req, res) => {
  await productController.getProducts(req, res);
});

app.post('/admin/products', async (req, res) => {
  await productController.addProductToStock(req, res);
})

// Cart
app.post('/carts', async (req, res) => {
  await cartController.addToCart(req, res);
});

app.get('/carts', async (req, res) => {
  await cartController.getCart(req, res);
});

app.delete('/carts/product/:id', async (req, res) => {
  await cartController.removeFromCart(req, res);
});

app.post('/carts/checkout', async (req, res) => {
  await cartController.checkout(req, res);
});

// Review
app.post('/reviews', async (req, res) => {
  await reviewController.addReview(req, res);
});

app.get('/reviews/product/:productId', async (req, res) => {
  await reviewController.getReviewsByProduct(req, res);
});

// Orders
app.get('/admin/orders', async (req, res) => {
  await ordersController.getItemsSoldByProduct(req, res);
});

async function startServer() {
  try {
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

startServer();
