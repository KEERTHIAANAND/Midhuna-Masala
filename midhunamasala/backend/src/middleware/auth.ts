import { Response, NextFunction } from 'express';
import { firebaseAuth } from '../config/firebase';
import { AuthenticatedRequest } from '../types';

/**
 * Middleware: Verify Firebase ID Token
 * 
 * Extracts the Bearer token from the Authorization header,
 * verifies it with Firebase Admin SDK, and attaches the
 * decoded user info to `req.user`.
 */
export async function authenticateUser(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'Missing or invalid Authorization header. Use: Bearer <firebase-id-token>',
            });
            return;
        }

        const idToken = authHeader.split('Bearer ')[1];

        // Verify the token with Firebase Admin SDK
        const decodedToken = await firebaseAuth.verifyIdToken(idToken);

        // Attach user info to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            name: decodedToken.name || decodedToken.displayName || undefined,
            avatar: decodedToken.picture || undefined,
        };

        next();
    } catch (error: any) {
        console.error('Auth middleware error:', error.message);

        if (error.code === 'auth/id-token-expired') {
            res.status(401).json({ success: false, error: 'Token expired. Please sign in again.' });
        } else if (error.code === 'auth/argument-error') {
            res.status(401).json({ success: false, error: 'Invalid token format.' });
        } else {
            res.status(401).json({ success: false, error: 'Authentication failed.' });
        }
    }
}
