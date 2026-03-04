import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { supabase } from '../config/supabase';

/**
 * Middleware: Admin-Only Access
 * 
 * Must be used AFTER `authenticateUser` middleware.
 * Checks if the authenticated user has 'admin' role in the database.
 */
export async function adminOnly(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, error: 'Not authenticated.' });
            return;
        }

        // Check user role in the database
        const { data: user, error } = await supabase
            .from('users')
            .select('role')
            .eq('firebase_uid', req.user.uid)
            .single();

        if (error || !user) {
            res.status(403).json({ success: false, error: 'User not found in database.' });
            return;
        }

        if (user.role !== 'admin') {
            res.status(403).json({ success: false, error: 'Admin access required.' });
            return;
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        res.status(500).json({ success: false, error: 'Failed to verify admin status.' });
    }
}
