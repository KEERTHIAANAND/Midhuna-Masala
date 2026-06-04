import type { Request, Response } from 'express';
import crypto from 'crypto';

import { env } from '../config/env';
import { supabase } from '../config/supabase';
import { sendOrderStatusUpdate } from '../utils/mailer';

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

/**
 * POST /api/webhooks/shiprocket
 *
 * Shiprocket sends webhook events when a shipment status changes.
 */
export async function shiprocketWebhook(req: Request, res: Response): Promise<void> {
    try {
        const webhookSecret = env.SHIPROCKET_WEBHOOK_SECRET;
        
        // Security Check: If a secret is configured in Render, ensure Shiprocket sent it.
        if (webhookSecret) {
            const authHeader = getHeaderAsString(req.headers['x-api-key']);
            if (authHeader !== webhookSecret) {
                console.error('Shiprocket webhook failed: Invalid x-api-key');
                res.status(401).json({ success: false, error: 'Unauthorized webhook' });
                return;
            }
        }

        let payload: any;
        
        // Shiprocket might send JSON or URL-encoded data.
        if (Buffer.isBuffer(req.body)) {
            payload = JSON.parse(req.body.toString('utf8'));
        } else {
            payload = req.body;
        }

        const internalOrderId = payload.channel_order_id;
        const trackingStatus = payload.current_status;

        if (!internalOrderId) {
            res.status(200).send("OK");
            return;
        }

        // Determine internal status based on Shiprocket status
        // Shiprocket statuses: PICKED UP, SHIPPED, IN TRANSIT, OUT FOR DELIVERY, DELIVERED, RETURNED, CANCELED
        let newStatus: string | null = null;
        if (trackingStatus === 'DELIVERED') {
            newStatus = 'delivered';
        } else if (['SHIPPED', 'IN TRANSIT', 'OUT FOR DELIVERY', 'PICKED UP'].includes(trackingStatus)) {
            newStatus = 'shipped';
        } else if (trackingStatus === 'CANCELED') {
            newStatus = 'cancelled';
        }

        if (newStatus) {
            // Update Supabase Database
            const { data: updatedOrder, error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('order_number', internalOrderId)
                .select(`*, users(email, name)`)
                .single();

            if (error) {
                console.error('Failed to update order status from Shiprocket webhook:', error);
            } else if (updatedOrder) {
                // Send email to customer
                const embeddedUser = Array.isArray(updatedOrder.users) ? updatedOrder.users[0] : updatedOrder.users;
                const userEmail = embeddedUser?.email;
                const userName = updatedOrder.customer_name || embeddedUser?.name;

                if (userEmail) {
                    sendOrderStatusUpdate(userEmail, userName, updatedOrder, newStatus).catch(e => 
                        console.error('Failed to send status update email:', e)
                    );
                }
            }
        }

        res.status(200).send("OK");
    } catch (err) {
        console.error('Shiprocket webhook error:', err);
        // Acknowledge anyway
        res.status(200).send("OK");
    }
}

