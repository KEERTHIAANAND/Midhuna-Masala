import { Response } from 'express';
import { z } from 'zod';
import { supabase } from '../config/supabase';
import { AuthenticatedRequest } from '../types';

const AdjustInventorySchema = z.object({
    deltaQty: z.coerce.number().int().min(-100000).max(100000).refine(v => v !== 0, 'deltaQty cannot be 0'),
    reason: z.string().trim().min(3).max(200).optional(),
});

function isUuid(value: string): boolean {
    return /^[0-9a-fA-F-]{36}$/.test(value);
}

/**
 * ADMIN: GET /api/inventory
 * List products with stock info.
 */
export async function listInventory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('id, name, slug, category, image_url, in_stock, stock_qty, low_stock_threshold, updated_at')
            .order('sort_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('List inventory error:', error);
            res.status(500).json({ success: false, error: 'Failed to load inventory.' });
            return;
        }

        const items = (data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            category: p.category,
            imageUrl: p.image_url,
            stockQty: Number(p.stock_qty || 0),
            lowStockThreshold: Number(p.low_stock_threshold || 5),
            inStock: Boolean(p.in_stock),
            updatedAt: p.updated_at,
        }));

        res.json({ success: true, items, count: items.length });
    } catch (err) {
        console.error('List inventory error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * ADMIN: POST /api/inventory/:id/adjust
 * Adjust stock by delta (positive restock / negative adjustment). Writes audit movement in DB.
 */
export async function adjustInventory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const productId = String((req.params as any).id || '').trim();
        if (!productId || !isUuid(productId)) {
            res.status(400).json({ success: false, error: 'Invalid product id.' });
            return;
        }

        const parsed = AdjustInventorySchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ success: false, error: 'Invalid payload.', details: parsed.error.flatten() });
            return;
        }

        const { deltaQty, reason } = parsed.data;

        const { data, error } = await supabase
            .rpc('adjust_inventory', {
                p_firebase_uid: req.user!.uid,
                p_product_id: productId,
                p_delta_qty: deltaQty,
                p_reason: reason || 'Admin inventory adjustment',
            })
            .single();

        if (error) {
            const message = error.message || 'Failed to update inventory.';
            const isBadRequest = /missing|invalid|not found|insufficient|failed/i.test(message);
            res.status(isBadRequest ? 400 : 500).json({ success: false, error: message });
            return;
        }

        res.json({ success: true, result: data });
    } catch (err) {
        console.error('Adjust inventory error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}
