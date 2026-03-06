import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    syncCart,
} from '../controllers/cart.controller';

const router = Router();

// All cart routes require authentication
// The user must be logged in to use their cart in the database.
// Guest users still use localStorage (handled by the frontend).

router.get('/', authenticateUser, getCart as any);           // GET    /api/cart
router.post('/', authenticateUser, addToCart as any);         // POST   /api/cart
router.post('/sync', authenticateUser, syncCart as any);     // POST   /api/cart/sync
router.put('/:productId', authenticateUser, updateCartItem as any);   // PUT    /api/cart/:productId
router.delete('/:productId', authenticateUser, removeFromCart as any); // DELETE /api/cart/:productId
router.delete('/', authenticateUser, clearCart as any);       // DELETE /api/cart

export default router;
