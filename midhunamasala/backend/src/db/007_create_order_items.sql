-- ═══════════════════════════════════════════════════════════════
-- ORDER ITEMS TABLE
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    -- snapshot of the product at the time of purchase
    product_id UUID REFERENCES products(id),
    product_name TEXT NOT NULL,
    product_image TEXT,
    price DECIMAL(10,2) NOT NULL,
    weight TEXT,

    quantity INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
