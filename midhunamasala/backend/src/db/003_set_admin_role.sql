-- ═══════════════════════════════════════════════════════════════
-- SET ADMIN ROLE
-- Run this in Supabase SQL Editor if your user doesn't have admin role
-- ═══════════════════════════════════════════════════════════════

-- Set admin role for your email
UPDATE users
SET role = 'admin'
WHERE email = 'keerthiaanand77@gmail.com';

-- Verify it worked
SELECT id, email, name, role FROM users WHERE email = 'keerthiaanand77@gmail.com';
