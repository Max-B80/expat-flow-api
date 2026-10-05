import express from 'express';
import { createVisa, getMyVisas, updateVisa, deleteVisa } from '../controllers/visaController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base route: /api/visas
router.route('/')
    .post(protect, createVisa)
    .get(protect, getMyVisas);

// Param route: /api/visas/:id
router.route('/:id')
    .put(protect, updateVisa)
    .delete(protect, deleteVisa);

export default router;