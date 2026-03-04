-- ═══════════════════════════════════════════
-- Midhuna Masala — Users Table
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    firebase_uid TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT 'User',
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups by firebase_uid
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (optional — our backend uses service role)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create a policy: service role can do everything (already true by default)
-- This is just for documentation purposes
CREATE POLICY "Service role has full access" ON users
    FOR ALL
    USING (true)
    WITH CHECK (true);
