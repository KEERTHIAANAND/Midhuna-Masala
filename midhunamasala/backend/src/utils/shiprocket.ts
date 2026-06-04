import { env } from '../config/env';

// Cache the token in memory to avoid logging in for every request
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0;

/**
 * Helper to log in to Shiprocket and get an auth token
 */
export async function getShiprocketToken(): Promise<string> {
    // If the user provided a static token, use that
    if (env.SHIPROCKET_TOKEN) {
        return env.SHIPROCKET_TOKEN;
    }

    // Otherwise, login with email and password
    if (!env.SHIPROCKET_EMAIL || !env.SHIPROCKET_PASSWORD) {
        throw new Error('Shiprocket credentials are not configured.');
    }

    // Use cached token if valid
    if (cachedToken && Date.now() < tokenExpiresAt) {
        return cachedToken;
    }

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: env.SHIPROCKET_EMAIL,
            password: env.SHIPROCKET_PASSWORD,
        }),
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('Shiprocket login failed:', data);
        throw new Error(data.message || 'Failed to login to Shiprocket');
    }

    cachedToken = data.token;
    // Token is usually valid for 10 days, we'll cache it for 9 days
    tokenExpiresAt = Date.now() + (9 * 24 * 60 * 60 * 1000); 
    
    return data.token;
}

/**
 * Pushes a paid order to Shiprocket
 */
export async function pushOrderToShiprocket(
    internalOrderId: string,
    orderNumber: string,
    customerName: string,
    customerEmail: string,
    customerPhone: string,
    address: any,
    items: any[],
    subTotal: number
): Promise<any> {
    try {
        const token = await getShiprocketToken();
        
        // Create Shiprocket order items
        const orderItems = items.map(item => ({
            name: item.product_name,
            sku: item.slug || `sku-${item.product_id}`,
            units: item.quantity,
            selling_price: item.price,
            discount: 0,
            tax: 0,
            hsn: ""
        }));

        // Construct the Shiprocket custom order payload
        const shiprocketPayload = {
            order_id: orderNumber,
            order_date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
            billing_customer_name: customerName || "Customer",
            billing_last_name: "",
            billing_address: address.street,
            billing_address_2: address.landmark || "",
            billing_city: address.city,
            billing_pincode: address.pincode,
            billing_state: address.state,
            billing_country: "India",
            billing_email: customerEmail || "support@midhunamasala.com",
            billing_phone: customerPhone || address.phone,
            shipping_is_billing: true,
            order_items: orderItems,
            payment_method: "Prepaid",
            sub_total: subTotal,
            length: 10,
            breadth: 10,
            height: 10,
            weight: 0.5 // Default placeholder weight in kg
        };

        const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(shiprocketPayload)
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error('Failed to create Shiprocket order:', data);
            return null;
        }

        console.log(`Shiprocket order created successfully for ${orderNumber}`);
        return data;
    } catch (error) {
        console.error('Error pushing order to Shiprocket:', error);
        return null;
    }
}
