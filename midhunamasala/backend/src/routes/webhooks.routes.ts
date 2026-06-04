import { Router } from 'express';

import { razorpayWebhook, shiprocketWebhook } from '../controllers/webhooks.controller';

const router = Router();

// Webhooks are server-to-server. Do NOT require user auth.
router.post('/razorpay', razorpayWebhook as any);
router.post('/shiprocket', shiprocketWebhook as any);

export default router;
