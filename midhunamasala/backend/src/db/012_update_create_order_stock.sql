-- ═══════════════════════════════════════════════════════════════
-- UPDATE ORDER RPC: decrement stock atomically + write movements
-- Run via migration runner or Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════

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
    v_attempts INT;
    v_requested_count INT;
    v_updated_count INT;
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

    -- Snapshot customer name
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

    -- Validate all requested products exist
    WITH requested_raw AS (
        SELECT
            (elem->>'productId')::uuid AS product_id,
            GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
        FROM jsonb_array_elements(p_items) elem
    ),
    requested AS (
        SELECT product_id, SUM(quantity)::int AS quantity
        FROM requested_raw
        GROUP BY product_id
    ),
    joined AS (
        SELECT r.product_id, r.quantity, p.id AS existing_id
        FROM requested r
        LEFT JOIN products p ON p.id = r.product_id
    )
    SELECT COUNT(*) INTO v_requested_count
    FROM requested;

    IF v_requested_count = 0 THEN
        RAISE EXCEPTION 'Items must be a non-empty array';
    END IF;

    -- Ensure every requested product exists
    IF EXISTS (
        WITH requested_raw AS (
            SELECT
                (elem->>'productId')::uuid AS product_id,
                GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
            FROM jsonb_array_elements(p_items) elem
        ),
        requested AS (
            SELECT product_id, SUM(quantity)::int AS quantity
            FROM requested_raw
            GROUP BY product_id
        )
        SELECT 1
        FROM requested r
        LEFT JOIN products p ON p.id = r.product_id
        WHERE p.id IS NULL
        LIMIT 1
    ) THEN
        RAISE EXCEPTION 'One or more items are invalid';
    END IF;

    -- Calculate subtotal using authoritative DB price
    WITH requested_raw AS (
        SELECT
            (elem->>'productId')::uuid AS product_id,
            GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
        FROM jsonb_array_elements(p_items) elem
    ),
    requested AS (
        SELECT product_id, SUM(quantity)::int AS quantity
        FROM requested_raw
        GROUP BY product_id
    )
    SELECT COALESCE(SUM((p.price::numeric) * r.quantity), 0)
    INTO v_subtotal
    FROM requested r
    JOIN products p ON p.id = r.product_id;

    IF v_subtotal <= 0 THEN
        RAISE EXCEPTION 'Subtotal calculation failed';
    END IF;

    -- Charges (server-defined)
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

            EXIT;
        EXCEPTION WHEN unique_violation THEN
            IF v_attempts >= 5 THEN
                RAISE EXCEPTION 'Failed to generate a unique order number';
            END IF;
        END;
    END LOOP;

    -- Decrement stock atomically (no backorders):
    -- Only succeeds if every item has sufficient stock_qty.
    WITH requested_raw AS (
        SELECT
            (elem->>'productId')::uuid AS product_id,
            GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
        FROM jsonb_array_elements(p_items) elem
    ),
    requested AS (
        SELECT product_id, SUM(quantity)::int AS quantity
        FROM requested_raw
        GROUP BY product_id
    ),
    updated AS (
        UPDATE products p
        SET stock_qty = p.stock_qty - r.quantity
        FROM requested r
        WHERE p.id = r.product_id
          AND p.stock_qty >= r.quantity
        RETURNING p.id
    )
    SELECT (SELECT COUNT(*) FROM requested), (SELECT COUNT(*) FROM updated)
    INTO v_requested_count, v_updated_count;

    IF v_updated_count <> v_requested_count THEN
        RAISE EXCEPTION 'One or more items are out of stock';
    END IF;

    -- Insert order items snapshot
    WITH requested_raw AS (
        SELECT
            (elem->>'productId')::uuid AS product_id,
            GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
        FROM jsonb_array_elements(p_items) elem
    ),
    requested AS (
        SELECT product_id, SUM(quantity)::int AS quantity
        FROM requested_raw
        GROUP BY product_id
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

    -- Inventory movements (audit)
    WITH requested_raw AS (
        SELECT
            (elem->>'productId')::uuid AS product_id,
            GREATEST(COALESCE((elem->>'quantity')::int, 1), 1) AS quantity
        FROM jsonb_array_elements(p_items) elem
    ),
    requested AS (
        SELECT product_id, SUM(quantity)::int AS quantity
        FROM requested_raw
        GROUP BY product_id
    )
    INSERT INTO inventory_movements (
        product_id,
        delta_qty,
        reason,
        ref_type,
        ref_id,
        created_by
    )
    SELECT
        r.product_id,
        -r.quantity,
        'Order placed',
        'order',
        v_order_id,
        v_user_id
    FROM requested r;

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
