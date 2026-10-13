import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import visaRoutes from './routes/visaRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// ... my route definitions (app.use('/api/users', ...), app.use('/api/visas', ...))




// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());////////
app.use(express.urlencoded({ extended: true }));//////

// Mount Auth Routes 🚦
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Mount visa routes
app.use('/api/visas', visaRoutes); // connect visa routes//////

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'ExpatFlow API is running 🚀' });

});


// Error handling middleware  🚨
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ⚡`);
});

