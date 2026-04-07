import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import {
    createOrder,
    listMyOrders,
    getMyOrder,
    cancelMyOrder,
    listAllOrders,
    getAdminAnalytics,
    getAnyOrder,
    updateOrderStatus,
    updatePaymentStatus,
} from '../controllers/orders.controller';

const router = Router();

// ─────────────────────────────────────────
// Admin routes (auth + admin)
// Keep these BEFORE user "/:id" route to avoid conflicts.
// ─────────────────────────────────────────
router.get('/admin', authenticateUser, adminOnly, listAllOrders as any);
router.get('/admin/analytics', authenticateUser, adminOnly, getAdminAnalytics as any);
router.get('/admin/:id', authenticateUser, adminOnly, getAnyOrder as any);
router.put('/admin/:id/status', authenticateUser, adminOnly, updateOrderStatus as any);
router.put('/admin/:id/payment-status', authenticateUser, adminOnly, updatePaymentStatus as any);

// ─────────────────────────────────────────
// User routes (auth)
// ─────────────────────────────────────────
router.post('/', authenticateUser, createOrder as any);
router.get('/', authenticateUser, listMyOrders as any);
router.get('/:id', authenticateUser, getMyOrder as any);
router.post('/:id/cancel', authenticateUser, cancelMyOrder as any);

export default router;
