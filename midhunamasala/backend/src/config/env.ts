import { z } from 'zod';

const nodeEnvSchema = z
  .enum(['development', 'test', 'production'])
  .optional()
  .default('development');

const envSchema = z
  .object({
    NODE_ENV: nodeEnvSchema,
    PORT: z.coerce.number().int().positive().optional(),
    CORS_ORIGIN: z.string().trim().optional(),

    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // Firebase Admin credentials
    // Option A (local): FIREBASE_SERVICE_ACCOUNT_PATH points to a JSON file
    FIREBASE_SERVICE_ACCOUNT_PATH: z.string().trim().optional(),

    // Option B (prod): provide the individual values
    FIREBASE_ADMIN_PROJECT_ID: z.string().trim().optional(),
    FIREBASE_ADMIN_CLIENT_EMAIL: z.string().trim().optional(),
    FIREBASE_ADMIN_PRIVATE_KEY: z.string().trim().optional(),
  })
  .superRefine((env, ctx) => {
    const hasServiceAccountPath = Boolean(env.FIREBASE_SERVICE_ACCOUNT_PATH);
    const hasInlineCreds = Boolean(env.FIREBASE_ADMIN_PROJECT_ID);

    if (!hasServiceAccountPath && !hasInlineCreds) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'Firebase Admin credentials missing. Set FIREBASE_SERVICE_ACCOUNT_PATH (local dev) OR FIREBASE_ADMIN_PROJECT_ID/FIREBASE_ADMIN_CLIENT_EMAIL/FIREBASE_ADMIN_PRIVATE_KEY (production).',
        path: ['FIREBASE_SERVICE_ACCOUNT_PATH'],
      });
      return;
    }

    if (hasInlineCreds) {
      if (!env.FIREBASE_ADMIN_CLIENT_EMAIL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Missing FIREBASE_ADMIN_CLIENT_EMAIL',
          path: ['FIREBASE_ADMIN_CLIENT_EMAIL'],
        });
      }
      if (!env.FIREBASE_ADMIN_PRIVATE_KEY) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Missing FIREBASE_ADMIN_PRIVATE_KEY',
          path: ['FIREBASE_ADMIN_PRIVATE_KEY'],
        });
      }
    }
  });

export const env = envSchema.parse(process.env);
