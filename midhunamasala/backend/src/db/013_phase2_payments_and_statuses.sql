-- ═══════════════════════════════════════════════════════════════
-- PHASE 2: Payments + Order Lifecycle Statuses
-- - Adds Razorpay metadata fields to orders
-- - Updates allowed order statuses
-- - Adds 'razorpay' payment method
-- - Adds cancel_order() RPC that restocks + writes audit movements
-- Run via migration runner or Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1) Expand order statuses
-- IMPORTANT: In older installs, the status check constraint name may be auto-generated
-- (e.g. "orders__new_status_check1" from the reorder migration). Drop it dynamically.
DO $$
DECLARE
    c RECORD;
BEGIN
    FOR c IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.orders'::regclass
          AND contype = 'c'
          AND (
              pg_get_constraintdef(oid) ILIKE '%status%'
              AND (pg_get_constraintdef(oid) ILIKE '%IN (%' OR pg_get_constraintdef(oid) ILIKE '%ANY (ARRAY%')
          )
    LOOP
        EXECUTE format('ALTER TABLE public.orders DROP CONSTRAINT %I', c.conname);
    END LOOP;
END $$;

-- Map legacy values to new ones (safe to run multiple times)
UPDATE orders SET status = 'pending' WHERE status = 'placed';
UPDATE orders SET status = 'packed'  WHERE status = 'confirmed';

ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE orders ADD CONSTRAINT orders_status_check CHECK (
    status IN ('pending', 'paid', 'packed', 'shipped', 'delivered', 'cancelled', 'refund')
);


-- 2) Expand payment methods to include Razorpay
-- Same deal: constraint name may be auto-generated (e.g. "orders__new_payment_method_check1")
DO $$
DECLARE
    c RECORD;
BEGIN
    FOR c IN
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = 'public.orders'::regclass
          AND contype = 'c'
          AND (
              pg_get_constraintdef(oid) ILIKE '%payment_method%'
              AND (pg_get_constraintdef(oid) ILIKE '%IN (%' OR pg_get_constraintdef(oid) ILIKE '%ANY (ARRAY%')
          )
    LOOP
        EXECUTE format('ALTER TABLE public.orders DROP CONSTRAINT %I', c.conname);
    END LOOP;
END $$;

ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check CHECK (
    payment_method IN ('cod', 'razorpay', 'upi', 'card', 'netbanking')
);


-- 3) Razorpay metadata fields
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS refunded_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_order_id
ON orders(razorpay_order_id)
WHERE razorpay_order_id IS NOT NULL;


-- 4) Cancel order RPC
-- Cancels an order for the current user and restores stock quantities.
-- Writes inventory_movements entries with ref_type='order'.
CREATE OR REPLACE FUNCTION cancel_order(
    p_firebase_uid TEXT,
    p_order_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id UUID;
    v_status TEXT;
BEGIN
    IF p_firebase_uid IS NULL OR LENGTH(TRIM(p_firebase_uid)) = 0 THEN
        RAISE EXCEPTION 'Missing firebase uid';
    END IF;

    IF p_order_id IS NULL THEN
        RAISE EXCEPTION 'Missing order id';
    END IF;

    SELECT id INTO v_user_id
    FROM users
    WHERE firebase_uid = p_firebase_uid
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Lock the order row for consistent cancellation + restock
    SELECT status INTO v_status
    FROM orders
    WHERE id = p_order_id AND user_id = v_user_id
    FOR UPDATE;

    IF v_status IS NULL THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    IF v_status NOT IN ('pending', 'paid', 'packed') THEN
        RAISE EXCEPTION 'Order cannot be cancelled at this stage';
    END IF;

    IF v_status = 'cancelled' THEN
        RETURN jsonb_build_object('orderId', p_order_id, 'status', 'cancelled');
    END IF;

    UPDATE orders
    SET status = 'cancelled',
        updated_at = NOW()
    WHERE id = p_order_id AND user_id = v_user_id;

    -- Restock + write movements
    WITH items AS (
        SELECT product_id, SUM(quantity)::int AS qty
        FROM order_items
        WHERE order_id = p_order_id
          AND product_id IS NOT NULL
        GROUP BY product_id
    ), updated AS (
        UPDATE products p
        SET stock_qty = p.stock_qty + i.qty
        FROM items i
        WHERE p.id = i.product_id
        RETURNING p.id
    )
    INSERT INTO inventory_movements (
        product_id,
        delta_qty,
        reason,
        ref_type,
        ref_id,
        created_by
    )
    SELECT
        i.product_id,
        i.qty,
        'Order cancelled',
        'order',
        p_order_id,
        v_user_id
    FROM items i;

    RETURN jsonb_build_object('orderId', p_order_id, 'status', 'cancelled');
END;
$$;
