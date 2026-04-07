-- ═══════════════════════════════════════════════════════════════
-- ORDER CREATION RPC (atomic)
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════
-- Requires tables: users, products, addresses, orders, order_items
-- Requires helper: generate_order_number() (defined below for convenience)

-- Create an order in a single transaction:
-- - validates user + address ownership
-- - validates products exist + in_stock
-- - calculates subtotal/total from DB prices (no client-trust)
-- - stores snapshot items in order_items

-- ─────────────────────────────────────────
-- HELPER: Generate order number
-- If you only run 006/007/008, this helper may not exist yet.
-- ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    year_part INTEGER;
    max_counter INTEGER;
    next_counter INTEGER;
    prefix TEXT;
BEGIN
    -- Format required by UI: MM-YYYY#### (example: MM-20260001)
    year_part := EXTRACT(YEAR FROM NOW())::INTEGER;

    -- Avoid race conditions without needing a separate counters table
    -- Lock is scoped to the current transaction and specific year
    PERFORM pg_advisory_xact_lock(year_part);

    prefix := 'MM-' || year_part::TEXT;

    SELECT COALESCE(MAX(RIGHT(order_number, 4)::INTEGER), 0)
    INTO max_counter
    FROM orders
    WHERE order_number ~ ('^MM-' || year_part::TEXT || '[0-9]{4}$');

    next_counter := max_counter + 1;
    RETURN prefix || LPAD(next_counter::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_order(
    p_firebase_uid TEXT,
    p_address_id UUID,
    p_payment_method TEXT,
    p_notes TEXT,
    p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_id UUID;
    v_order_id UUID;
    v_order_number TEXT;
    v_customer_name TEXT;
    v_item_count INTEGER;
    v_subtotal NUMERIC(10,2);
    v_shipping NUMERIC(10,2);
    v_cod_charge NUMERIC(10,2);
    v_total NUMERIC(10,2);
    v_missing_count INT;
    v_attempts INT;
BEGIN
    IF p_firebase_uid IS NULL OR LENGTH(TRIM(p_firebase_uid)) = 0 THEN
        RAISE EXCEPTION 'Missing firebase uid';
    END IF;

    IF p_address_id IS NULL THEN
        RAISE EXCEPTION 'Missing address id';
    END IF;

    IF p_payment_method NOT IN ('upi', 'card', 'netbanking', 'cod') THEN
        RAISE EXCEPTION 'Invalid payment method';
    END IF;

    IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Items must be a non-empty array';
    END IF;

    -- Resolve user id
    SELECT id INTO v_user_id
    FROM users
    WHERE firebase_uid = p_firebase_uid
    LIMIT 1;

    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not found';
    END IF;

    -- Snapshot customer name (so admin UI can show it reliably)
    SELECT name INTO v_customer_name
    FROM users
    WHERE id = v_user_id
    LIMIT 1;

    -- Total items count (sum of quantities)
    SELECT COALESCE(
        SUM(GREATEST(COALESCE((elem->>'quantity')::int, 1), 1)),
        0
    )
    INTO v_item_count
    FROM jsonb_array_elements(p_items) elem;

    -- Validate address belongs to user
    PERFORM 1
    FROM addresses
    WHERE id = p_address_id AND user_id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Address not found for user';
    END IF;

    -- Validate all requested products exist and are in stock
    WITH requested AS (
        SELECT
            (elem->>'productId')::uuid AS product_id,
            GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
        FROM jsonb_array_elements(p_items) elem
    ),
    joined AS (
        SELECT r.product_id, r.quantity, p.in_stock
        FROM requested r
        LEFT JOIN products p ON p.id = r.product_id
    )
    SELECT COUNT(*) INTO v_missing_count
    FROM joined
    WHERE product_id IS NULL OR in_stock IS DISTINCT FROM TRUE;

    IF v_missing_count > 0 THEN
        RAISE EXCEPTION 'One or more items are invalid or out of stock';
    END IF;

    -- Calculate subtotal using authoritative DB price
    WITH requested AS (
        SELECT
            (elem->>'productId')::uuid AS product_id,
            GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
        FROM jsonb_array_elements(p_items) elem
    )
    SELECT COALESCE(SUM((p.price::numeric) * r.quantity), 0)
    INTO v_subtotal
    FROM requested r
    JOIN products p ON p.id = r.product_id;

    IF v_subtotal <= 0 THEN
        RAISE EXCEPTION 'Subtotal calculation failed';
    END IF;

    -- Charges (server-defined)
    -- Keep these aligned with frontend checkout display rules.
    v_shipping := CASE WHEN v_subtotal >= 500 THEN 0 ELSE 49 END;
    v_cod_charge := CASE WHEN p_payment_method = 'cod' THEN 20 ELSE 0 END;
    v_total := v_subtotal + v_shipping + v_cod_charge;

    -- Create order (retry if order_number collides)
    v_attempts := 0;
    LOOP
        v_attempts := v_attempts + 1;
        v_order_number := generate_order_number();
        BEGIN
            INSERT INTO orders (
                order_number,
                user_id,
                customer_name,
                item_count,
                address_id,
                status,
                payment_method,
                payment_status,
                subtotal,
                shipping,
                cod_charge,
                total,
                notes
            ) VALUES (
                v_order_number,
                v_user_id,
                v_customer_name,
                v_item_count,
                p_address_id,
                'placed',
                p_payment_method,
                'pending',
                v_subtotal,
                v_shipping,
                v_cod_charge,
                v_total,
                p_notes
            )
            RETURNING id INTO v_order_id;

            EXIT; -- success
        EXCEPTION WHEN unique_violation THEN
            IF v_attempts >= 5 THEN
                RAISE EXCEPTION 'Failed to generate a unique order number';
            END IF;
        END;
    END LOOP;

    -- Insert order items snapshot
    WITH requested AS (
        SELECT
            (elem->>'productId')::uuid AS product_id,
            GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
        FROM jsonb_array_elements(p_items) elem
    )
    INSERT INTO order_items (
        order_id,
        product_id,
        product_name,
        product_image,
        price,
        weight,
        quantity
    )
    SELECT
        v_order_id,
        p.id,
        p.name,
        p.image_url,
        p.price,
        p.weight,
        r.quantity
    FROM requested r
    JOIN products p ON p.id = r.product_id;

    RETURN jsonb_build_object(
        'orderId', v_order_id,
        'orderNumber', v_order_number,
        'subtotal', v_subtotal,
        'shipping', v_shipping,
        'codCharge', v_cod_charge,
        'total', v_total,
        'status', 'placed',
        'paymentStatus', 'pending'
    );
END;
$$;
