-- ═══════════════════════════════════════════════════════════════
-- INVENTORY / STOCK
-- Run via migration runner or Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- 1) Stock fields on products
ALTER TABLE products
    ADD COLUMN IF NOT EXISTS stock_qty INTEGER NOT NULL DEFAULT 0;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NOT NULL DEFAULT 5;

ALTER TABLE products
    DROP CONSTRAINT IF EXISTS products_stock_qty_non_negative;
ALTER TABLE products
    ADD CONSTRAINT products_stock_qty_non_negative CHECK (stock_qty >= 0);

ALTER TABLE products
    DROP CONSTRAINT IF EXISTS products_low_stock_threshold_non_negative;
ALTER TABLE products
    ADD CONSTRAINT products_low_stock_threshold_non_negative CHECK (low_stock_threshold >= 0);

-- Preserve existing in_stock behavior by seeding a non-zero stock for products
-- that were previously marked in_stock=true.
-- IMPORTANT: Update these quantities in Admin → Inventory after migration.
UPDATE products
SET stock_qty = CASE WHEN in_stock IS TRUE THEN GREATEST(stock_qty, 100) ELSE 0 END
WHERE stock_qty = 0;


-- 2) Keep products.in_stock derived from stock_qty
CREATE OR REPLACE FUNCTION sync_products_in_stock()
RETURNS TRIGGER AS $$
BEGIN
    NEW.in_stock := (COALESCE(NEW.stock_qty, 0) > 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_products_in_stock ON products;
CREATE TRIGGER set_products_in_stock
    BEFORE INSERT OR UPDATE OF stock_qty ON products
    FOR EACH ROW EXECUTE FUNCTION sync_products_in_stock();

-- Ensure in_stock is correct post-migration
UPDATE products
SET in_stock = (COALESCE(stock_qty, 0) > 0);


-- 3) Inventory movements audit trail
CREATE TABLE IF NOT EXISTS inventory_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    delta_qty INTEGER NOT NULL,
    reason TEXT,
    ref_type TEXT NOT NULL DEFAULT 'manual' CHECK (ref_type IN ('order', 'manual', 'restock', 'adjustment')),
    ref_id UUID,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_movements_product_id ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_created_at ON inventory_movements(created_at);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_ref ON inventory_movements(ref_type, ref_id);


-- 4) Admin inventory adjustment RPC
-- Uses firebase UID to resolve a user_id for audit.
CREATE OR REPLACE FUNCTION adjust_inventory(
    p_firebase_uid TEXT,
    p_product_id UUID,
    p_delta_qty INTEGER,
    p_reason TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id UUID;
    v_new_stock INTEGER;
BEGIN
    IF p_firebase_uid IS NULL OR LENGTH(TRIM(p_firebase_uid)) = 0 THEN
        RAISE EXCEPTION 'Missing firebase uid';
    END IF;

    IF p_product_id IS NULL THEN
        RAISE EXCEPTION 'Missing product id';
    END IF;

    IF p_delta_qty IS NULL OR p_delta_qty = 0 THEN
        RAISE EXCEPTION 'Invalid delta quantity';
    END IF;

    -- Resolve user id (for audit)
    SELECT id INTO v_user_id
    FROM users
    WHERE firebase_uid = p_firebase_uid
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Atomic update with non-negative guard
    UPDATE products
    SET stock_qty = stock_qty + p_delta_qty
    WHERE id = p_product_id
      AND (stock_qty + p_delta_qty) >= 0
    RETURNING stock_qty INTO v_new_stock;

    IF v_new_stock IS NULL THEN
        RAISE EXCEPTION 'Stock update failed (insufficient stock or product not found)';
    END IF;

    INSERT INTO inventory_movements (
        product_id,
        delta_qty,
        reason,
        ref_type,
        ref_id,
        created_by
    ) VALUES (
        p_product_id,
        p_delta_qty,
        NULLIF(TRIM(p_reason), ''),
        CASE WHEN p_delta_qty > 0 THEN 'restock' ELSE 'adjustment' END,
        NULL,
        v_user_id
    );

    RETURN jsonb_build_object(
        'productId', p_product_id,
        'stockQty', v_new_stock,
        'inStock', (v_new_stock > 0)
    );
END;
$$;
