import { Response } from 'express';
import { AuthenticatedRequest } from '../types';
import { supabase } from '../config/supabase';

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

        // Upsert user: insert if new, update if existing
        const { data, error } = await supabase
            .from('users')
            .upsert(
                {
                    firebase_uid: uid,
                    email: email,
                    name: name || 'User',
                    avatar_url: avatar || null,
                    role: role,
                    updated_at: new Date().toISOString(),
                },
                {
                    onConflict: 'firebase_uid',
                }
            )
            .select()
            .single();

        if (error) {
            console.error('Sync user error:', error);
            res.status(500).json({ success: false, error: 'Failed to sync user.' });
            return;
        }

        res.json({
            success: true,
            user: {
                id: data.id,
                firebaseUid: data.firebase_uid,
                email: data.email,
                name: data.name,
                phone: data.phone,
                avatarUrl: data.avatar_url,
                role: data.role,
                createdAt: data.created_at,
            },
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
            user: {
                id: data.id,
                firebaseUid: data.firebase_uid,
                email: data.email,
                name: data.name,
                phone: data.phone,
                avatarUrl: data.avatar_url,
                role: data.role,
                createdAt: data.created_at,
            },
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
            user: {
                id: data.id,
                firebaseUid: data.firebase_uid,
                email: data.email,
                name: data.name,
                phone: data.phone,
                avatarUrl: data.avatar_url,
                role: data.role,
            },
        });
    } catch (error) {
        console.error('Update me error:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
}
