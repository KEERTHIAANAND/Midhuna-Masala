import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import {
    listProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/products.controller';

const router = Router();

// Public routes
router.get('/', listProducts as any);
router.get('/:slug', getProduct as any);

// Admin-only routes (require auth + admin role)
router.post('/', authenticateUser, adminOnly, createProduct as any);
router.put('/:id', authenticateUser, adminOnly, updateProduct as any);
router.delete('/:id', authenticateUser, adminOnly, deleteProduct as any);

export default router;
