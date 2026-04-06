import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { supabase } from '../config/supabase';

function mapUserRowToResponse(data: any) {
    return {
        id: data.id,
        firebaseUid: data.firebase_uid,
        email: data.email,
        name: data.name,
        phone: data.phone,
        avatarUrl: data.avatar_url,
        role: data.role,
        createdAt: data.created_at,
    };
}

/**
 * POST /api/auth/sync-user
 * 
 * Called after Firebase login on the frontend.
 * Upserts the user into Supabase `users` table.
 * If the user doesn't exist, creates them. If they do, updates their info.
 */
export async function syncUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { uid, email, name, avatar } = req.user!;

        // Check admin emails from env
        const adminEmails = (process.env.ADMIN_EMAILS || '')
            .split(',')
            .map(e => e.trim().toLowerCase());

        const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'customer';

        const now = new Date().toISOString();

        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', uid)
            .maybeSingle();

        if (fetchError) {
            console.error('Sync user lookup error:', fetchError);
            res.status(500).json({ success: false, error: 'Failed to sync user.' });
            return;
        }

        let data = existingUser;

        if (existingUser) {
            const { data: updatedUser, error: updateError } = await supabase
                .from('users')
                .update({
                    firebase_uid: uid,
                    email,
                    role,
                    updated_at: now,
                })
                .eq('firebase_uid', uid)
                .select()
                .single();

            if (updateError) {
                console.error('Sync user update error:', updateError);
                res.status(500).json({ success: false, error: 'Failed to sync user.' });
                return;
            }

            data = updatedUser;
        } else {
            const { data: insertedUser, error: insertError } = await supabase
                .from('users')
                .insert({
                    firebase_uid: uid,
                    email,
                    name: name || 'User',
                    avatar_url: avatar || null,
                    role,
                    updated_at: now,
                })
                .select()
                .single();

            if (insertError) {
                console.error('Sync user insert error:', insertError);
                res.status(500).json({ success: false, error: 'Failed to sync user.' });
                return;
            }

            data = insertedUser;
        }

        res.json({
            success: true,
            user: mapUserRowToResponse(data),
        });
    } catch (error) {
        console.error('Sync user error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * GET /api/auth/me
 * 
 * Returns the current authenticated user's profile from Supabase.
 */
export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { uid } = req.user!;

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('firebase_uid', uid)
            .single();

        if (error || !data) {
            res.status(404).json({ success: false, error: 'User not found. Please sync your account first.' });
            return;
        }

        res.json({
            success: true,
            user: mapUserRowToResponse(data),
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}

/**
 * PUT /api/auth/me
 * 
 * Updates the current user's profile (name, phone).
 */
export async function updateMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const { uid } = req.user!;
        const { name, phone } = req.body;

        const updateData: Record<string, any> = { updated_at: new Date().toISOString() };
        if (name !== undefined) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;

        const { data, error } = await supabase
            .from('users')
            .update(updateData)
            .eq('firebase_uid', uid)
            .select()
            .single();

        if (error || !data) {
            res.status(500).json({ success: false, error: 'Failed to update profile.' });
            return;
        }

        res.json({
            success: true,
            user: mapUserRowToResponse(data),
        });
    } catch (error) {
        console.error('Update me error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}
