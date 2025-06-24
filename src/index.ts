import express from 'express';
import { User } from './models';
import { userController } from './controllers';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

async function startServer() {
  try {
    // await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
}

startServer();
