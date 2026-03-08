import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import {
    listAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress,
} from '../controllers/addresses.controller';

const router = Router();

// All address routes require authentication.
// Users can only access their own addresses (enforced in controller).

router.get('/', authenticateUser, listAddresses as any);          // GET    /api/addresses
router.get('/:id', authenticateUser, getAddress as any);          // GET    /api/addresses/:id
router.post('/', authenticateUser, createAddress as any);         // POST   /api/addresses
router.put('/:id', authenticateUser, updateAddress as any);       // PUT    /api/addresses/:id
router.delete('/:id', authenticateUser, deleteAddress as any);    // DELETE /api/addresses/:id

export default router;
