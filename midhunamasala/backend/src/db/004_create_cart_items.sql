-- ═══════════════════════════════════════════════════════════════
-- CART ITEMS TABLE
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- This table stores each user's cart.
-- Each row = 1 product in the user's cart with a quantity.
-- The UNIQUE constraint on (user_id, product_id) ensures a user
-- can't have duplicate entries for the same product.

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Which user owns this cart item
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Which product is in the cart (links to products table)
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    
    -- How many of this product
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    
    -- When was this item added/updated
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One user can only have one entry per product
    UNIQUE(user_id, product_id)
);

-- Index for fast lookup: "Get all cart items for this user"
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);

-- Auto-update the updated_at timestamp when quantity changes
DROP TRIGGER IF EXISTS set_updated_at_cart_items ON cart_items;
CREATE TRIGGER set_updated_at_cart_items
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
