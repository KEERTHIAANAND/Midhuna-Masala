import type { Request, Response } from 'express';
import crypto from 'crypto';

import { env } from '../config/env';
import { supabase } from '../config/supabase';

function timingSafeEqualHex(a: string, b: string): boolean {
    try {
        const aBuf = Buffer.from(a, 'hex');
        const bBuf = Buffer.from(b, 'hex');
        if (aBuf.length !== bBuf.length) return false;
        return crypto.timingSafeEqual(aBuf, bBuf);
    } catch {
        return false;
    }
}

function getHeaderAsString(value: unknown): string | null {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    return null;
}

/**
 * POST /api/webhooks/razorpay
 *
 * Razorpay signs the RAW request body using your webhook secret.
 * This handler expects `req.body` to be a Buffer (configured via express.raw).
 */
export async function razorpayWebhook(req: Request, res: Response): Promise<void> {
    const webhookSecret = env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
        // Misconfiguration on server; respond 500 so you notice quickly.
        res.status(500).json({ success: false, error: 'Webhook secret is not configured.' });
        return;
    }

    const signature = getHeaderAsString(req.headers['x-razorpay-signature']);
    if (!signature) {
        res.status(400).json({ success: false, error: 'Missing x-razorpay-signature header.' });
        return;
    }

    const rawBody = req.body;
    if (!Buffer.isBuffer(rawBody)) {
        res.status(400).json({ success: false, error: 'Invalid webhook body format.' });
        return;
    }

    const expected = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

    if (!timingSafeEqualHex(expected, signature)) {
        res.status(400).json({ success: false, error: 'Invalid webhook signature.' });
        return;
    }

    let payload: any;
    try {
        payload = JSON.parse(rawBody.toString('utf8'));
    } catch {
        res.status(400).json({ success: false, error: 'Invalid JSON payload.' });
        return;
    }

    const event: string | undefined = payload?.event;
    const paymentEntity = payload?.payload?.payment?.entity;
    const orderEntity = payload?.payload?.order?.entity;

    const razorpayOrderId: string | undefined = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId: string | undefined = paymentEntity?.id;

    // If we can't correlate, acknowledge to avoid retries.
    if (!razorpayOrderId) {
        res.status(200).json({ success: true });
        return;
    }

    // Decide status updates based on event.
    const nowIso = new Date().toISOString();
    const update: Record<string, any> = {};

    if (event === 'payment.captured' || event === 'order.paid') {
        update.payment_status = 'paid';
        update.status = 'paid';
        if (razorpayPaymentId) update.razorpay_payment_id = razorpayPaymentId;
        update.paid_at = nowIso;
    } else if (event === 'payment.failed') {
        update.payment_status = 'failed';
        if (razorpayPaymentId) update.razorpay_payment_id = razorpayPaymentId;
    } else {
        // Ignore other events for now (acknowledge).
        res.status(200).json({ success: true });
        return;
    }

    try {
        const { error } = await supabase
            .from('orders')
            .update(update)
            .eq('razorpay_order_id', razorpayOrderId);

        if (error) {
            console.error('Razorpay webhook DB update failed:', error);
            // Acknowledge anyway to avoid excessive retries; monitor logs.
        }
    } catch (err) {
        console.error('Razorpay webhook handler error:', err);
        // Acknowledge anyway to avoid retries storms.
    }

    res.status(200).json({ success: true });
}
