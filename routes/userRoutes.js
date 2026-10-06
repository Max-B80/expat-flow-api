import express from 'express';
import { getUserProfile, updateUserProfile, getUsers, registerUser, authUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route for user login 🔑
router.post('/login', authUser); // 👈 2. Add the login route

// Profile route handles both GET (fetch) and PUT (update)
router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

// Admin-only route
router.route('/')
    .post(registerUser)              // 🔓 Public route to register
    .get(protect, admin, getUsers);  // 🔒 Admin-only route to fetch users

export default router;