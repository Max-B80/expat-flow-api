import express from 'express';
import { createVisa, getMyVisas, updateVisa, deleteVisa, getAllVisas } from '../controllers/visaController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import upload from '../config/cloudinary.js'; // 👈 1. Import upload middleware

const router = express.Router();

// Base route: /api/visas
router.route('/')
    .post(protect, upload.single('document'), createVisa)
    .get(protect, getMyVisas);
    
// Admin route to get all visas 👑
router.get('/all', protect, admin, getAllVisas);

// Param route: /api/visas/:id
router.route('/:id')
    .put(protect, updateVisa)
    .delete(protect, deleteVisa);




export default router;