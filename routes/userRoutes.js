import express from 'express';
import { getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// The protect middleware runs FIRST before getUserProfile 🛡️
router.get('/profile', protect, getUserProfile);

export default router;