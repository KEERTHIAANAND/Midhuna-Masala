import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { supabase } from '../config/supabase';

/**
 * HELPER: Get the user's Supabase UUID from their Firebase UID.
 * 
 * Why? The cart_items table uses `user_id` (Supabase UUID),
 * but the auth middleware gives us `firebase_uid`.
 * This function bridges the two.
 */
async function getUserId(firebaseUid: string): Promise<string | null> {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('firebase_uid', firebaseUid)
        .single();

    if (error || !data) return null;
    return data.id;
}

/**
 * GET /api/cart
 * 
 * Returns all items in the logged-in user's cart.
 * Joins with the `products` table to get product details (name, image, price).
 * This way the frontend gets everything it needs in one API call.
 */
export async function getCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        // Query cart_items and JOIN with products to get full details
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                id,
                quantity,
                product_id,
                products (
                    id,
                    name,
                    slug,
                    price,
                    weight,
                    image_url,
                    in_stock,
                    category
                )
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Get cart error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch cart.' });
            return;
        }

        // Transform to frontend-friendly format
        const items = (data || []).map((item: any) => ({
            cartItemId: item.id,              // UUID of the cart_items row
            productId: item.product_id,       // UUID of the product
            slug: item.products?.slug,        // Product slug (used as "id" in frontend)
            name: item.products?.name || 'Unknown Product',
            price: item.products ? parseFloat(item.products.price) : 0,
            weight: item.products?.weight || '100g',
            image: item.products?.image_url || '',
            inStock: item.products?.in_stock ?? true,
            quantity: item.quantity,
        }));

        res.json({ success: true, items, count: items.length });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * POST /api/cart
 * 
 * Adds an item to the cart. If the product is already in the cart,
 * it increments the quantity instead of creating a duplicate.
 * 
 * Body: { productId: "uuid-of-product", quantity: 1 }
 */
export async function addToCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { productId, quantity = 1 } = req.body;

        if (!productId) {
            res.status(400).json({ success: false, error: 'productId is required.' });
            return;
        }

        // Check if this product already exists in the user's cart
        const { data: existing } = await supabase
            .from('cart_items')
            .select('id, quantity')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existing) {
            // Product already in cart → increment quantity
            const newQuantity = existing.quantity + quantity;
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: newQuantity })
                .eq('id', existing.id);

            if (error) {
                console.error('Update cart item error:', error);
                res.status(500).json({ success: false, error: 'Failed to update cart.' });
                return;
            }

            res.json({ success: true, message: 'Cart updated.', quantity: newQuantity });
        } else {
            // New product → insert into cart
            const { error } = await supabase
                .from('cart_items')
                .insert({
                    user_id: userId,
                    product_id: productId,
                    quantity: quantity,
                });

            if (error) {
                console.error('Add to cart error:', error);
                res.status(500).json({ success: false, error: 'Failed to add to cart.' });
                return;
            }

            res.status(201).json({ success: true, message: 'Added to cart.' });
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * PUT /api/cart/:productId
 * 
 * Updates the quantity of a specific product in the cart.
 * If quantity is 0 or less, the item is removed.
 * 
 * Body: { quantity: 3 }
 */
export async function updateCartItem(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { productId } = req.params;
        const { quantity } = req.body;

        if (quantity === undefined || quantity === null) {
            res.status(400).json({ success: false, error: 'quantity is required.' });
            return;
        }

        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('user_id', userId)
                .eq('product_id', productId);

            if (error) {
                console.error('Remove cart item error:', error);
                res.status(500).json({ success: false, error: 'Failed to remove item.' });
                return;
            }

            res.json({ success: true, message: 'Item removed from cart.' });
            return;
        }

        // Update quantity
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity })
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) {
            console.error('Update cart item error:', error);
            res.status(500).json({ success: false, error: 'Failed to update quantity.' });
            return;
        }

        res.json({ success: true, message: 'Quantity updated.', quantity });
    } catch (error) {
        console.error('Update cart item error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * DELETE /api/cart/:productId
 * 
 * Removes a specific product from the cart.
 */
export async function removeFromCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { productId } = req.params;

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) {
            console.error('Remove from cart error:', error);
            res.status(500).json({ success: false, error: 'Failed to remove item.' });
            return;
        }

        res.json({ success: true, message: 'Item removed from cart.' });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * DELETE /api/cart
 * 
 * Clears the entire cart for the logged-in user.
 * Used after order placement.
 */
export async function clearCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);

        if (error) {
            console.error('Clear cart error:', error);
            res.status(500).json({ success: false, error: 'Failed to clear cart.' });
            return;
        }

        res.json({ success: true, message: 'Cart cleared.' });
    } catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * POST /api/cart/sync
 * 
 * Syncs the local cart (from localStorage) to the database.
 * Called when a user logs in to merge their guest cart with their saved cart.
 * 
 * Body: { items: [{ slug: "product-slug", quantity: 2 }, ...] }
 */
export async function syncCart(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            res.json({ success: true, message: 'No items to sync.' });
            return;
        }

        // For each local cart item, find the product and upsert into cart_items
        for (const item of items) {
            if (!item.slug && !item.productId) continue;

            // Find the product UUID from slug
            let productId = item.productId;
            if (!productId && item.slug) {
                const { data: product } = await supabase
                    .from('products')
                    .select('id')
                    .eq('slug', item.slug)
                    .single();

                if (!product) continue; // Skip if product not found
                productId = product.id;
            }

            // Upsert: if product already in cart, take the higher quantity
            const { data: existing } = await supabase
                .from('cart_items')
                .select('id, quantity')
                .eq('user_id', userId)
                .eq('product_id', productId)
                .single();

            if (existing) {
                // Take the higher quantity between local and DB
                const newQty = Math.max(existing.quantity, item.quantity || 1);
                await supabase
                    .from('cart_items')
                    .update({ quantity: newQty })
                    .eq('id', existing.id);
            } else {
                await supabase
                    .from('cart_items')
                    .insert({
                        user_id: userId,
                        product_id: productId,
                        quantity: item.quantity || 1,
                    });
            }
        }

        res.json({ success: true, message: 'Cart synced successfully.' });
    } catch (error) {
        console.error('Sync cart error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}
