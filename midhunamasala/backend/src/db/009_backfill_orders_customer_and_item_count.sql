-- ═══════════════════════════════════════════════════════════════
-- BACKFILL: orders.customer_name + orders.item_count
-- Run this once in Supabase SQL Editor AFTER applying 006 + 008 updates
-- Safe to re-run.
-- ═══════════════════════════════════════════════════════════════

-- Fill customer_name from users table
UPDATE orders o
SET customer_name = u.name
FROM users u
WHERE o.user_id = u.id
  AND (o.customer_name IS NULL OR LENGTH(TRIM(o.customer_name)) = 0);

-- Fill item_count from order_items (sum of quantities)
UPDATE orders o
SET item_count = s.item_count
FROM (
    SELECT order_id, COALESCE(SUM(quantity), 0) AS item_count
    FROM order_items
    GROUP BY order_id
) s
WHERE o.id = s.order_id
  AND (o.item_count IS NULL OR o.item_count = 0);
