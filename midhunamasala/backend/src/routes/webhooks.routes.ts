import { Router } from 'express';

import { razorpayWebhook } from '../controllers/webhooks.controller';

const router = Router();

// Webhooks are server-to-server. Do NOT require user auth.
router.post('/razorpay', razorpayWebhook as any);

export default router;
