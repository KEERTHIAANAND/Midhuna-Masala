import * as admin from 'firebase-admin';
import path from 'path';

// Initialize Firebase Admin SDK
// Supports two methods:
// 1. JSON file (local dev): Set FIREBASE_SERVICE_ACCOUNT_PATH in .env
// 2. Environment variables (production): Set individual FIREBASE_ADMIN_* vars

if (!admin.apps.length) {
    let credential: admin.credential.Credential;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
        // Method 1: Load from JSON file (local development)
        const serviceAccount = require(
            path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
        );
        credential = admin.credential.cert(serviceAccount);
    } else if (process.env.FIREBASE_ADMIN_PROJECT_ID) {
        // Method 2: Load from environment variables (production)
        credential = admin.credential.cert({
            projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
            clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
            // Environment variables store the private key with escaped newlines — convert them back
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        });
    } else {
        throw new Error(
            'Firebase Admin SDK credentials not found. ' +
            'Set FIREBASE_SERVICE_ACCOUNT_PATH (local) or FIREBASE_ADMIN_* env vars (production).'
        );
    }

    admin.initializeApp({ credential });
}

export const firebaseAdmin = admin;
export const firebaseAuth = admin.auth();

