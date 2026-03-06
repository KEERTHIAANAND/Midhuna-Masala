import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { supabase } from '../config/supabase';

/**
 * HELPER: Get Supabase user UUID from Firebase UID
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
 * HELPER: Transform DB address to frontend-friendly format
 */
function mapAddress(row: any) {
    return {
        id: row.id,
        fullName: row.full_name,
        phone: row.phone,
        street: row.street,
        landmark: row.landmark || '',
        city: row.city,
        state: row.state,
        pincode: row.pincode,
        label: row.label,
        isDefault: row.is_default,
        createdAt: row.created_at,
    };
}

/**
 * GET /api/addresses
 * 
 * Returns all saved addresses for the logged-in user.
 * Default address is returned first.
 */
export async function listAddresses(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('user_id', userId)
            .order('is_default', { ascending: false })  // Default first
            .order('created_at', { ascending: false });  // Then newest

        if (error) {
            console.error('List addresses error:', error);
            res.status(500).json({ success: false, error: 'Failed to fetch addresses.' });
            return;
        }

        const addresses = (data || []).map(mapAddress);

        res.json({ success: true, addresses, count: addresses.length });
    } catch (error) {
        console.error('List addresses error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * GET /api/addresses/:id
 * 
 * Returns a single address by ID.
 */
export async function getAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { id } = req.params;

        const { data, error } = await supabase
            .from('addresses')
            .select('*')
            .eq('id', id)
            .eq('user_id', userId)  // Ensure user can only access their own
            .single();

        if (error || !data) {
            res.status(404).json({ success: false, error: 'Address not found.' });
            return;
        }

        res.json({ success: true, address: mapAddress(data) });
    } catch (error) {
        console.error('Get address error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * POST /api/addresses
 * 
 * Creates a new address for the logged-in user.
 * If isDefault is true, unsets any previous default.
 * 
 * Body: { fullName, phone, street, landmark?, city, state, pincode, label, isDefault? }
 */
export async function createAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { fullName, phone, street, landmark, city, state, pincode, label, isDefault } = req.body;

        // Validate required fields
        if (!fullName || !phone || !street || !city || !state || !pincode) {
            res.status(400).json({ success: false, error: 'Missing required fields.' });
            return;
        }

        // If this is the default, unset previous defaults
        if (isDefault) {
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', userId)
                .eq('is_default', true);
        }

        // Check if this is the first address → make it default automatically
        const { count } = await supabase
            .from('addresses')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', userId);

        const shouldBeDefault = isDefault || count === 0;

        // Insert the new address
        const { data, error } = await supabase
            .from('addresses')
            .insert({
                user_id: userId,
                full_name: fullName,
                phone,
                street,
                landmark: landmark || null,
                city,
                state,
                pincode,
                label: label || 'home',
                is_default: shouldBeDefault,
            })
            .select()
            .single();

        if (error) {
            console.error('Create address error:', error);
            res.status(500).json({ success: false, error: 'Failed to create address.' });
            return;
        }

        res.status(201).json({ success: true, address: mapAddress(data) });
    } catch (error) {
        console.error('Create address error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * PUT /api/addresses/:id
 * 
 * Updates an existing address.
 * 
 * Body: { fullName?, phone?, street?, landmark?, city?, state?, pincode?, label?, isDefault? }
 */
export async function updateAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { id } = req.params;
        const { fullName, phone, street, landmark, city, state, pincode, label, isDefault } = req.body;

        // Build update object with only provided fields
        const updateData: Record<string, any> = {};
        if (fullName !== undefined) updateData.full_name = fullName;
        if (phone !== undefined) updateData.phone = phone;
        if (street !== undefined) updateData.street = street;
        if (landmark !== undefined) updateData.landmark = landmark;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;
        if (pincode !== undefined) updateData.pincode = pincode;
        if (label !== undefined) updateData.label = label;

        // Handle default toggle
        if (isDefault === true) {
            // Unset previous defaults
            await supabase
                .from('addresses')
                .update({ is_default: false })
                .eq('user_id', userId)
                .eq('is_default', true);
            updateData.is_default = true;
        } else if (isDefault === false) {
            updateData.is_default = false;
        }

        const { data, error } = await supabase
            .from('addresses')
            .update(updateData)
            .eq('id', id)
            .eq('user_id', userId)
            .select()
            .single();

        if (error || !data) {
            console.error('Update address error:', error);
            res.status(500).json({ success: false, error: 'Failed to update address.' });
            return;
        }

        res.json({ success: true, address: mapAddress(data) });
    } catch (error) {
        console.error('Update address error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * DELETE /api/addresses/:id
 * 
 * Deletes an address. If the deleted address was the default,
 * the most recent remaining address becomes the new default.
 */
export async function deleteAddress(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = await getUserId(req.user!.uid);
        if (!userId) {
            res.status(404).json({ success: false, error: 'User not found.' });
            return;
        }

        const { id } = req.params;

        // Check if this was the default
        const { data: toDelete } = await supabase
            .from('addresses')
            .select('is_default')
            .eq('id', id)
            .eq('user_id', userId)
            .single();

        // Delete the address
        const { error } = await supabase
            .from('addresses')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

        if (error) {
            console.error('Delete address error:', error);
            res.status(500).json({ success: false, error: 'Failed to delete address.' });
            return;
        }

        // If deleted address was the default, pick a new default
        if (toDelete?.is_default) {
            const { data: remaining } = await supabase
                .from('addresses')
                .select('id')
                .eq('user_id', userId)
                .order('created_at', { ascending: false })
                .limit(1);

            if (remaining && remaining.length > 0) {
                await supabase
                    .from('addresses')
                    .update({ is_default: true })
                    .eq('id', remaining[0].id);
            }
        }

        res.json({ success: true, message: 'Address deleted.' });
    } catch (error) {
        console.error('Delete address error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}
