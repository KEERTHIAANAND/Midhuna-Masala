type RequiredClientEnv = {
  NEXT_PUBLIC_API_URL: string;
  NEXT_PUBLIC_FIREBASE_API_KEY: string;
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;
  NEXT_PUBLIC_FIREBASE_APP_ID: string;
};

// NOTE: In Next.js client bundles, env vars are inlined only for static accesses like
// process.env.NEXT_PUBLIC_*. Dynamic indexing (process.env[name]) will be undefined.
function requireEnv(name: keyof RequiredClientEnv, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(
      `Missing ${name}. Create midhunamasala/.env.local (copy from .env.local.example) and restart the dev server.`
    );
  }
  return value;
}

export const clientEnv = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',

  NEXT_PUBLIC_FIREBASE_API_KEY: requireEnv(
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY
  ),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: requireEnv(
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  ),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: requireEnv(
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: requireEnv(
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  ),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: requireEnv(
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ),
  NEXT_PUBLIC_FIREBASE_APP_ID: requireEnv(
    'NEXT_PUBLIC_FIREBASE_APP_ID',
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID
  ),
} as const;
