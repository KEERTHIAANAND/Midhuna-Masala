-- ═══════════════════════════════════════════════════════════════
-- MIGRATION: Reorder columns in orders table
-- Goal column order:
--   user_id, customer_name, address_id, item_count
--
-- NOTE: Postgres does not support reordering columns via ALTER TABLE.
-- This migration recreates the table with the desired order and copies data.
--
-- Run this ONCE in Supabase SQL Editor during a quiet period.
-- ═══════════════════════════════════════════════════════════════

BEGIN;

-- Prevent concurrent writes while swapping tables
LOCK TABLE orders IN ACCESS EXCLUSIVE MODE;
LOCK TABLE order_items IN ACCESS EXCLUSIVE MODE;

-- Drop dependent FK temporarily
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_order_id_fkey;

-- Drop updated_at trigger temporarily
DROP TRIGGER IF EXISTS set_updated_at_orders ON orders;

-- Create new table with desired column order
CREATE TABLE orders__new (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,

    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_name TEXT,
    address_id UUID REFERENCES addresses(id),
    item_count INTEGER NOT NULL DEFAULT 0,

    status TEXT NOT NULL DEFAULT 'placed' CHECK (
        status IN ('placed', 'confirmed', 'shipped', 'delivered', 'cancelled')
    ),

    payment_method TEXT NOT NULL CHECK (
        payment_method IN ('upi', 'card', 'netbanking', 'cod')
    ),

    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (
        payment_status IN ('pending', 'paid', 'failed', 'refunded')
    ),

    subtotal DECIMAL(10,2) NOT NULL,
    shipping DECIMAL(10,2) NOT NULL DEFAULT 0,
    cod_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL,

    notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Copy data (preserve ids + timestamps)
INSERT INTO orders__new (
    id,
    order_number,
    user_id,
    customer_name,
    address_id,
    item_count,
    status,
    payment_method,
    payment_status,
    subtotal,
    shipping,
    cod_charge,
    total,
    notes,
    created_at,
    updated_at
)
SELECT
    id,
    order_number,
    user_id,
    customer_name,
    address_id,
    COALESCE(item_count, 0),
    status,
    payment_method,
    payment_status,
    subtotal,
    shipping,
    cod_charge,
    total,
    notes,
    created_at,
    updated_at
FROM orders;

-- Swap tables
ALTER TABLE orders RENAME TO orders__old;
ALTER TABLE orders__new RENAME TO orders;

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Recreate updated_at trigger
CREATE TRIGGER set_updated_at_orders
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Re-attach FK from order_items
ALTER TABLE order_items
    ADD CONSTRAINT order_items_order_id_fkey
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

-- Drop old table
DROP TABLE orders__old;

COMMIT;
