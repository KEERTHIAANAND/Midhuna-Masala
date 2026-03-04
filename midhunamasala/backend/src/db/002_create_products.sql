-- ═══════════════════════════════════════════════════════════════
-- PRODUCTS TABLE + SEED DATA
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('POWDER', 'BLEND', 'WHOLE SPICES')),
    price DECIMAL(10,2) NOT NULL,
    weight TEXT,
    type TEXT,
    image_url TEXT,
    in_stock BOOLEAN DEFAULT true,
    rating DECIMAL(2,1) DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_products ON products;
CREATE TRIGGER set_updated_at_products
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─────────────────────────────────────────
-- SEED DATA — Your existing 6 products
-- ─────────────────────────────────────────

INSERT INTO products (name, slug, category, price, weight, type, image_url, description, rating, in_stock, is_featured, sort_order) VALUES
(
    'Guntur Red Chilli Powder',
    'guntur-red-chilli',
    'POWDER',
    6.49,
    '200g',
    'Stone Ground',
    '/images/products/IMG-20250726-WA0019.jpg',
    'Sun-dried Guntur chillies, stone-ground to preserve the fiery heat..',
    4.8,
    true,
    true,
    1
),
(
    'Erode Turmeric Powder (Manjal)',
    'erode-turmeric',
    'POWDER',
    4.99,
    '100g',
    'Stone Ground',
    '/images/products/IMG-20250727-WA0006.jpg',
    'Pure Erode turmeric with high curcumin content. Traditionally...',
    4.8,
    true,
    true,
    2
),
(
    'Chettinad Masala Blend',
    'chettinad-masala',
    'BLEND',
    9.99,
    '100g',
    'Stone Ground',
    '/images/products/IMG-20250726-WA0021.jpg',
    'Authentic 18-spice blend roasted in iron woks. The secret to the...',
    4.9,
    true,
    true,
    3
),
(
    'Cumin Seeds',
    'cumin',
    'POWDER',
    5.49,
    '100g',
    'Stone Ground',
    '/images/products/IMG-20250726-WA0022.jpg',
    'Premium cumin seeds with rich aroma and flavor',
    4.7,
    true,
    false,
    4
),
(
    'Coriander Seeds',
    'coriander',
    'POWDER',
    4.49,
    '100g',
    'Stone Ground',
    '/images/products/IMG-20250726-WA0023.jpg',
    'Fresh coriander seeds for authentic taste',
    4.6,
    true,
    false,
    5
),
(
    'Fennel Seeds',
    'fennel',
    'WHOLE SPICES',
    5.99,
    '100g',
    'Seeds & Pods',
    '/images/products/IMG-20250726-WA0022.jpg',
    'Sweet and aromatic fennel seeds',
    4.5,
    true,
    false,
    6
);
