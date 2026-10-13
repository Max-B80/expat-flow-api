import express from 'express';
import upload from '../config/cloudinary.js'; // 👈 1. Import Cloudinary upload middleware
import { createVisa, getMyVisas, updateVisa, deleteVisa, getAllVisas, getVisaById } from '../controllers/visaController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { visaValidationRules, updateVisaValidationRules } from '../middleware/validatorMiddleware.js';

const router = express.Router();

// Base route: /api/visas
router.route('/')
    .post(protect, upload.single('document'), visaValidationRules, createVisa) // 👈 2. Uses imported Cloudinary upload
    .get(protect, getMyVisas);

// Admin route to get all visas 👑
router.get('/all', protect, admin, getAllVisas);

// Param route: /api/visas/:id
router.route('/:id')
    .get(protect, getVisaById)
    .put(protect, updateVisaValidationRules, updateVisa)
    .delete(protect, deleteVisa);

export default router; 