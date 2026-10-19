import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import visaRoutes from './routes/visaRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

connectDB();
const app = express();
const clientOrigin = new URL(process.env.CLIENT_URL || 'http://localhost:5173').origin;
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'ExpatFlow API is running' }));
app.use('/api/auth', authRoutes);

if (process.env.CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
  app.use('/api', clerkMiddleware({ authorizedParties: [clientOrigin] }));
} else {
  console.warn('Clerk is not configured. Add CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to the backend .env.');
  app.use('/api', (req, res) => res.status(503).json({ message: 'Authentication is not configured. Add the Clerk API keys and restart the backend.' }));
}
app.use('/api/users', userRoutes);
app.use('/api/visas', visaRoutes);
app.use(notFound);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
