import { Router } from 'express';
import { authenticateUser } from '../middleware/auth';
import { syncUser, getMe, updateMe } from '../controllers/auth.controller';

const router = Router();

// POST /api/auth/sync-user — Sync Firebase user to Supabase (called on login)
router.post('/sync-user', authenticateUser, syncUser as any);

// GET /api/auth/me — Get current user's profile
router.get('/me', authenticateUser, getMe as any);

// PUT /api/auth/me — Update current user's profile
router.put('/me', authenticateUser, updateMe as any);

export default router;
