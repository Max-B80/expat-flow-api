import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getUsers,
    registerUser,
    authUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public authentication endpoints 🔓
router.post('/register', registerUser);
router.post('/login', authUser);

// Protected user profile endpoints 🔒
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin-only endpoints 👑
router.route('/')
    .get(protect, admin, getUsers);

export default router;