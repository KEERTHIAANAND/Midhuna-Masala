import { Router } from 'express';

import { razorpayWebhook, shiprocketWebhook } from '../controllers/webhooks.controller';

const router = Router();

// Webhooks are server-to-server. Do NOT require user auth.
router.post('/razorpay', razorpayWebhook as any);
// NOTE: Shiprocket blocks URLs containing 'shiprocket', 'webhook', or 'sr'.
// That's why this route is named /shipping-updates instead.
router.post('/shipping-updates', shiprocketWebhook as any);

export default router;
