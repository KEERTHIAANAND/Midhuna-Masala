-- ═══════════════════════════════════════════════════════════════
-- ADDRESSES TABLE
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- Each user can save multiple delivery addresses.
-- One address can be marked as 'default' for quick checkout.
-- Labels (home/work/other) help users organize their addresses.

CREATE TABLE IF NOT EXISTS addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Which user owns this address
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Address details
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    street TEXT NOT NULL,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    
    -- Label: home, work, or other (shows different icon in UI)
    label TEXT NOT NULL DEFAULT 'home' CHECK (label IN ('home', 'work', 'other')),
    
    -- Is this the default address for quick checkout?
    is_default BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookup: "Get all addresses for this user"
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
