import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { adminOnly } from '../middleware/adminOnly';
import { adjustInventory, listInventory } from '../controllers/inventory.controller';

const router = Router();

router.get('/', authenticateUser, adminOnly, listInventory as any);
router.post('/:id/adjust', authenticateUser, adminOnly, adjustInventory as any);

export default router;
