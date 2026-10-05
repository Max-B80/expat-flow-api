import express from 'express';
import { getUserProfile, updateUserProfile, getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Profile route handles both GET (fetch) and PUT (update)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin-only route
router.route('/').get(protect, admin, getUsers);

export default router;