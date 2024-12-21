import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { envs } from './config';
import { MongoDatabase } from './data/mongodb';
import { AppRoutes } from './presentation/routes';

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:4321', // Replace with your frontend URL
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use(AppRoutes.routes);

// MongoDB connection initialization (for local dev or during Vercel initialization)
(async () => {
  try {
    await MongoDatabase.connect({
      dbName: envs.MONGO_DB_NAME,
      mongoUrl: envs.MONGO_URL,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
})();

// Export the app for Vercel
export default app;
