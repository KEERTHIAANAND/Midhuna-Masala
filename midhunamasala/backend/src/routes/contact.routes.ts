import { Router } from 'express';
import { submitContactForm } from '../controllers/contact.controller';

const router = Router();

// POST /api/contact
router.post('/', submitContactForm as any);

export default router;
