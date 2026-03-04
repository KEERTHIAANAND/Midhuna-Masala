import * as admin from 'firebase-admin';
import path from 'path';

// Load service account from file
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './midhunamasala-87f75-firebase-adminsdk-fbsvc-8558e562f1.json';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

export const firebaseAdmin = admin;
export const firebaseAuth = admin.auth();
