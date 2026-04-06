import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../types';
import { supabase } from '../config/supabase';

const OrderStatusSchema = z.enum(['placed', 'confirmed', 'shipped', 'delivered', 'cancelled']);
const PaymentMethodSchema = z.enum(['upi', 'card', 'netbanking', 'cod']);
const PaymentStatusSchema = z.enum(['pending', 'paid', 'failed', 'refunded']);

const CreateOrderItemSchema = z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(99).default(1),
});

const CreateOrderSchema = z.object({
    addressId: z.string().uuid(),
    paymentMethod: PaymentMethodSchema,
    notes: z.string().max(500).optional(),
    items: z.array(CreateOrderItemSchema).min(1),
});

const PaginationSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
    status: z.string().optional(),
});

const AdminAnalyticsQuerySchema = z.object({
    // Range selector for stats and category breakdown (trend stays last 7 days)
    days: z.coerce.number().int().min(1).max(365).optional(),
    range: z.enum(['7d', '30d', '90d', 'year']).optional(),
});

type AnalyticsTrendPoint = { day: string; value: number };
type CategoryBreakdownRow = { name: string; amount: number };

function getRangeDays(range?: string, days?: number): number {
    if (typeof days === 'number' && Number.isFinite(days)) return Math.min(365, Math.max(1, days));
    if (range === '7d') return 7;
    if (range === '30d') return 30;
    if (range === '90d') return 90;
    if (range === 'year') return 365;
    return 30;
}

function pctChange(current: number, previous: number): number {
    if (!previous || previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}

async function fetchOrdersInRange(startIso: string, endIso: string): Promise<any[]> {
    const pageSize = 1000;
    let offset = 0;
    const all: any[] = [];

    while (true) {
        const { data, error } = await supabase
            .from('orders')
            .select('id, user_id, total, created_at, status')
            .gte('created_at', startIso)
            .lte('created_at', endIso)
            .neq('status', 'cancelled')
            .order('created_at', { ascending: false })
            .range(offset, offset + pageSize - 1);

        if (error) throw error;
        const rows = data || [];
        all.push(...rows);
        if (rows.length < pageSize) break;
        offset += pageSize;
    }
    return all;
}

function buildLast7DayTrend(orders: any[], end: Date): AnalyticsTrendPoint[] {
    const points: AnalyticsTrendPoint[] = [];
    const dayKeys: string[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(end);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        dayKeys.push(key);
        points.push({ day: d.toLocaleDateString('en-IN', { weekday: 'short' }), value: 0 });
    }
    const idx = new Map<string, number>(dayKeys.map((k, i) => [k, i]));
    for (const o of orders) {
        const created = String(o.created_at || '');
        const key = created.slice(0, 10);
        const i = idx.get(key);
        if (i === undefined) continue;
        points[i].value += Number(o.total || 0);
    }
    // Round to 2 decimals (currency)
    return points.map(p => ({ ...p, value: Math.round(p.value * 100) / 100 }));
}

async function fetchCategoryBreakdownForOrders(orderIds: string[]): Promise<CategoryBreakdownRow[]> {
    if (!orderIds.length) return [];

    // Fetch items in chunks to avoid URL size limits
    const chunkSize = 200;
    const items: any[] = [];
    for (let i = 0; i < orderIds.length; i += chunkSize) {
        const chunk = orderIds.slice(i, i + chunkSize);
        const { data, error } = await supabase
            .from('order_items')
            .select('product_id, price, quantity, order_id')
            .in('order_id', chunk);
        if (error) throw error;
        items.push(...(data || []));
    }

    const productIds = Array.from(new Set(items.map(it => it.product_id).filter(Boolean)));
    const productCategoryById = new Map<string, string>();
    if (productIds.length) {
        for (let i = 0; i < productIds.length; i += 200) {
            const chunk = productIds.slice(i, i + 200);
            const { data, error } = await supabase
                .from('products')
                .select('id, category')
                .in('id', chunk);
            if (error) throw error;
            for (const p of data || []) productCategoryById.set((p as any).id, (p as any).category);
        }
    }

    const amountByCategory = new Map<string, number>();
    for (const it of items) {
        const pid = String((it as any).product_id || '');
        const category = productCategoryById.get(pid) || 'OTHER';
        const line = Number((it as any).price || 0) * Number((it as any).quantity || 0);
        amountByCategory.set(category, (amountByCategory.get(category) || 0) + line);
    }

    return Array.from(amountByCategory.entries())
        .map(([name, amount]) => ({ name, amount: Math.round(amount * 100) / 100 }))
        .sort((a, b) => b.amount - a.amount);
}

async function getUserId(firebaseUid: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', firebaseUid)
        .single();

    if (error || !data) return null;
    return data.id;
}

function getParamAsString(value: unknown): string | null {
    if (typeof value === 'string') return value;
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    return null;
}

function mapOrderRow(row: any) {
    const embeddedUser = Array.isArray(row.users) ? row.users[0] : row.users;
    const embeddedItems = row.order_items;
    const directItemCount = typeof row.item_count === 'number' ? row.item_count : undefined;
    const embeddedItemCount = Array.isArray(embeddedItems)
        ? embeddedItems.length
        : (embeddedItems && typeof embeddedItems === 'object' && 'count' in embeddedItems)
            ? Number((embeddedItems as any).count)
            : undefined;
    const itemCount = directItemCount ?? embeddedItemCount;

    const customerName = embeddedUser?.name || row.customer_name || undefined;

    return {
        id: row.id,
        orderNumber: row.order_number,
        status: row.status,
        paymentMethod: row.payment_method,
        paymentStatus: row.payment_status,
        subtotal: row.subtotal ? parseFloat(row.subtotal) : 0,
        shipping: row.shipping ? parseFloat(row.shipping) : 0,
        codCharge: row.cod_charge ? parseFloat(row.cod_charge) : 0,
        total: row.total ? parseFloat(row.total) : 0,
        notes: row.notes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        itemCount,
        customer: customerName
            ? {
                name: customerName,
                email: embeddedUser?.email,
                phone: embeddedUser?.phone || undefined,
            }
            : undefined,
    };
}

function mapOrderItemRow(row: any) {
    return {
        id: row.id,
        productId: row.product_id,
        name: row.product_name,
        image: row.product_image,
        price: row.price ? parseFloat(row.price) : 0,
        weight: row.weight,
        quantity: row.quantity,
    };
}

/**
 * USER: POST /api/orders
 * Creates an order for the logged-in user.
 * Uses DB-side RPC `create_order()` for atomic creation and server-side price calculation.
 */
export async function createOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const parsed = CreateOrderSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ success: false, error: 'Invalid payload.', details: parsed.error.flatten() });
            return;
        }

        const { addressId, paymentMethod, notes, items } = parsed.data;

        const { data, error } = await supabase
            .rpc('create_order', {
                p_firebase_uid: req.user!.uid,
                p_address_id: addressId,
                p_payment_method: paymentMethod,
                p_notes: notes || null,
                p_items: items,
            })
            .single();

        if (error) {
            const message = error.message || 'Failed to create order.';
            // Surface validation-ish errors as 400
            const isBadRequest = /missing|invalid|not found|out of stock|subtotal/i.test(message);
            res.status(isBadRequest ? 400 : 500).json({ success: false, error: message });
            return;
        }

        res.status(201).json({ success: true, order: data });
    } catch (err) {
        console.error('Create order error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * USER: GET /api/orders
 * List current user's orders
 */
export async function listMyOrders(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const queryParsed = PaginationSchema.safeParse(req.query);
        if (!queryParsed.success) {
            res.status(400).json({ success: false, error: 'Invalid query parameters.' });
            return;
        }

        const { limit, offset, status } = queryParsed.data;

        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        let query = supabase
            .from('orders')
            .select('*, order_items (id)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            const statusParsed = OrderStatusSchema.safeParse(status);
            if (!statusParsed.success) {
                res.status(400).json({ success: false, error: 'Invalid status filter.' });
                return;
            }
            query = query.eq('status', statusParsed.data);
        }

        const { data, error } = await query;
        if (error) {
            console.error('List my orders error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch orders.' });
            return;
        }

        res.json({
            success: true,
            orders: (data || []).map(mapOrderRow),
            count: (data || []).length,
            limit,
            offset,
        });
    } catch (err) {
        console.error('List my orders error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * USER: GET /api/orders/:id
 * Get a single order + items (must belong to user)
 */
export async function getMyOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const id = getParamAsString((req.params as any).id);
        if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
            res.status(400).json({ success: false, error: 'Invalid order id.' });
            return;
        }

        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                order_items (
                    id,
                    product_id,
                    product_name,
                    product_image,
                    price,
                    weight,
                    quantity
                )
            `)
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (error || !data) {
            res.status(404).json({ success: false, error: 'Order not found.' });
            return;
        }

        res.json({
            success: true,
            order: mapOrderRow(data),
            items: (data.order_items || []).map(mapOrderItemRow),
        });
    } catch (err) {
        console.error('Get my order error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * USER: POST /api/orders/:id/cancel
 * Allows cancelling only while status is 'placed'.
 */
export async function cancelMyOrder(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const id = getParamAsString((req.params as any).id);
        if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
            res.status(400).json({ success: false, error: 'Invalid order id.' });
            return;
        }

        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        // Ensure it's cancellable
        const { data: existing, error: findErr } = await supabase
            .from('orders')
            .select('id, status')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        if (findErr || !existing) {
            res.status(404).json({ success: false, error: 'Order not found.' });
            return;
        }

        if (existing.status !== 'placed') {
            res.status(400).json({ success: false, error: 'Order cannot be cancelled at this stage.' });
            return;
        }

        const { data, error } = await supabase
            .from('orders')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .eq('user_id', userId)
            .select('*')
            .single();

        if (error || !data) {
            console.error('Cancel order error:', error);
            res.status(500).json({ success: false, error: 'Failed to cancel order.' });
            return;
        }

        res.json({ success: true, order: mapOrderRow(data) });
    } catch (err) {
        console.error('Cancel my order error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * ADMIN: GET /api/orders/admin
 * List all orders
 */
export async function listAllOrders(req: Request, res: Response): Promise<void> {
    try {
        const queryParsed = PaginationSchema.safeParse(req.query);
        if (!queryParsed.success) {
            res.status(400).json({ success: false, error: 'Invalid query parameters.' });
            return;
        }

        const { limit, offset, status } = queryParsed.data;

        // Fetch orders (no embedding) to avoid brittle relationship shapes
        let ordersQuery = supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (status) {
            const statusParsed = OrderStatusSchema.safeParse(status);
            if (!statusParsed.success) {
                res.status(400).json({ success: false, error: 'Invalid status filter.' });
                return;
            }
            ordersQuery = ordersQuery.eq('status', statusParsed.data);
        }

        const { data: ordersRows, error: ordersError } = await ordersQuery;
        if (ordersError) {
            console.error('List all orders error:', ordersError);
            res.status(500).json({ success: false, error: 'Failed to fetch orders.' });
            return;
        }

        const orderIds = (ordersRows || []).map((o: any) => o.id).filter(Boolean);
        const userIds = Array.from(new Set((ordersRows || []).map((o: any) => o.user_id).filter(Boolean)));

        // Fetch users for customer display
        const { data: usersRows } = userIds.length
            ? await supabase.from('users').select('id, name, email, phone').in('id', userIds)
            : { data: [] as any[] };
        const userById = new Map<string, any>((usersRows || []).map((u: any) => [u.id, u]));

        // Fetch item quantities to compute count (sum of quantities)
        const { data: orderItemsRows } = orderIds.length
            ? await supabase.from('order_items').select('order_id, quantity').in('order_id', orderIds)
            : { data: [] as any[] };
        const qtyByOrderId = new Map<string, number>();
        for (const r of orderItemsRows || []) {
            const oid = (r as any).order_id;
            const q = Number((r as any).quantity || 0);
            qtyByOrderId.set(oid, (qtyByOrderId.get(oid) || 0) + q);
        }

        const mapped = (ordersRows || []).map((row: any) => {
            const userRow = userById.get(row.user_id);
            const qty = qtyByOrderId.get(row.id);

            return mapOrderRow({
                ...row,
                // Provide a stable "users" object for mapOrderRow
                users: userRow || row.users,
                // Prefer computed quantity; fallback to stored item_count if present
                item_count: typeof qty === 'number' ? qty : row.item_count,
                // Prefer stored customer_name; fallback to joined user name
                customer_name: row.customer_name || userRow?.name,
            });
        });

        res.json({
            success: true,
            orders: mapped,
            count: mapped.length,
            limit,
            offset,
        });
    } catch (err) {
        console.error('List all orders error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * ADMIN: GET /api/orders/admin/:id
 * Get any order + items
 */
export async function getAnyOrder(req: Request, res: Response): Promise<void> {
    try {
        const id = getParamAsString((req.params as any).id);
        if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
            res.status(400).json({ success: false, error: 'Invalid order id.' });
            return;
        }

        const { data: orderRow, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single();

        if (orderError || !orderRow) {
            res.status(404).json({ success: false, error: 'Order not found.' });
            return;
        }

        const { data: userRow } = await supabase
            .from('users')
            .select('id, name, email, phone')
            .eq('id', (orderRow as any).user_id)
            .maybeSingle();

        const { data: itemsRows } = await supabase
            .from('order_items')
            .select('id, product_id, product_name, product_image, price, weight, quantity')
            .eq('order_id', id);

        const items = (itemsRows || []).map(mapOrderItemRow);
        const qtySum = items.reduce((acc, it) => acc + Number((it as any).quantity || 0), 0);

        res.json({
            success: true,
            order: mapOrderRow({
                ...orderRow,
                users: userRow || (orderRow as any).users,
                item_count: qtySum,
                customer_name: (orderRow as any).customer_name || (userRow as any)?.name,
            }),
            items,
        });
    } catch (err) {
        console.error('Get any order error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * ADMIN: GET /api/orders/admin/analytics
 * Returns revenue/orders stats, growth vs previous period, 7-day revenue trend,
 * and category revenue breakdown.
 */
export async function getAdminAnalytics(req: Request, res: Response): Promise<void> {
    try {
        const parsed = AdminAnalyticsQuerySchema.safeParse(req.query);
        if (!parsed.success) {
            res.status(400).json({ success: false, error: 'Invalid query parameters.' });
            return;
        }

        const rangeDays = getRangeDays(parsed.data.range, parsed.data.days);
        const end = new Date();
        const start = new Date(end);
        start.setDate(start.getDate() - rangeDays);

        const prevEnd = new Date(start);
        const prevStart = new Date(start);
        prevStart.setDate(prevStart.getDate() - rangeDays);

        const [currentOrders, previousOrders] = await Promise.all([
            fetchOrdersInRange(start.toISOString(), end.toISOString()),
            fetchOrdersInRange(prevStart.toISOString(), prevEnd.toISOString()),
        ]);

        const currentTotalRevenue = currentOrders.reduce((acc, o) => acc + Number(o.total || 0), 0);
        const currentTotalOrders = currentOrders.length;
        const currentAvgOrderValue = currentTotalOrders > 0 ? currentTotalRevenue / currentTotalOrders : 0;

        const previousTotalRevenue = previousOrders.reduce((acc, o) => acc + Number(o.total || 0), 0);
        const previousTotalOrders = previousOrders.length;
        const previousAvgOrderValue = previousTotalOrders > 0 ? previousTotalRevenue / previousTotalOrders : 0;

        // Trend is always the last 7 days
        const trendStart = new Date(end);
        trendStart.setDate(trendStart.getDate() - 7);
        const trendOrders = await fetchOrdersInRange(trendStart.toISOString(), end.toISOString());
        const revenueTrend = buildLast7DayTrend(trendOrders, end);

        // Category breakdown for the selected range
        const categoryBreakdown = await fetchCategoryBreakdownForOrders(currentOrders.map(o => o.id));

        // Extra KPIs for dashboard convenience
        const [{ count: allTimeOrdersCount }, { count: productsCount }] = await Promise.all([
            supabase
                .from('orders')
                .select('id', { count: 'exact', head: true })
                .neq('status', 'cancelled'),
            supabase.from('products').select('id', { count: 'exact', head: true }),
        ]);

        res.json({
            success: true,
            range: {
                days: rangeDays,
                start: start.toISOString(),
                end: end.toISOString(),
            },
            stats: {
                totalRevenue: Math.round(currentTotalRevenue * 100) / 100,
                totalOrders: currentTotalOrders,
                avgOrderValue: Math.round(currentAvgOrderValue * 100) / 100,
                revenueChangePct: Math.round(pctChange(currentTotalRevenue, previousTotalRevenue) * 10) / 10,
                ordersChangePct: Math.round(pctChange(currentTotalOrders, previousTotalOrders) * 10) / 10,
                avgOrderValueChangePct: Math.round(pctChange(currentAvgOrderValue, previousAvgOrderValue) * 10) / 10,
            },
            revenueTrend,
            categoryBreakdown,
            kpis: {
                allTimeOrders: allTimeOrdersCount || 0,
                productsCount: productsCount || 0,
            },
            lastUpdatedAt: new Date().toISOString(),
        });
    } catch (err) {
        console.error('Admin analytics error:', err);
        res.status(500).json({ success: false, error: 'Failed to compute analytics.' });
    }
}

const UpdateStatusSchema = z.object({ status: OrderStatusSchema });
const UpdatePaymentStatusSchema = z.object({ paymentStatus: PaymentStatusSchema });

/**
 * ADMIN: PUT /api/orders/admin/:id/status
 */
export async function updateOrderStatus(req: Request, res: Response): Promise<void> {
    try {
        const id = getParamAsString((req.params as any).id);
        if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
            res.status(400).json({ success: false, error: 'Invalid order id.' });
            return;
        }

        const parsed = UpdateStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ success: false, error: 'Invalid payload.', details: parsed.error.flatten() });
            return;
        }

        const { status } = parsed.data;

        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select('*')
            .single();

        if (error || !data) {
            console.error('Update order status error:', error);
            res.status(404).json({ success: false, error: 'Order not found.' });
            return;
        }

        res.json({ success: true, order: mapOrderRow(data) });
    } catch (err) {
        console.error('Update order status error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * ADMIN: PUT /api/orders/admin/:id/payment-status
 */
export async function updatePaymentStatus(req: Request, res: Response): Promise<void> {
    try {
        const id = getParamAsString((req.params as any).id);
        if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
            res.status(400).json({ success: false, error: 'Invalid order id.' });
            return;
        }

        const parsed = UpdatePaymentStatusSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(400).json({ success: false, error: 'Invalid payload.', details: parsed.error.flatten() });
            return;
        }

        const { paymentStatus } = parsed.data;

        const { data, error } = await supabase
            .from('orders')
            .update({ payment_status: paymentStatus })
            .eq('id', id)
            .select('*')
            .single();

        if (error || !data) {
            console.error('Update payment status error:', error);
            res.status(404).json({ success: false, error: 'Order not found.' });
            return;
        }

        res.json({ success: true, order: mapOrderRow(data) });
    } catch (err) {
        console.error('Update payment status error:', err);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}
