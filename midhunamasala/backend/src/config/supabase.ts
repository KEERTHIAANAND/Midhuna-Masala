import { createClient } from '@supabase/supabase-js';

import { env } from './env';

// Service role client — bypasses Row Level Security
// Only use this on the backend!
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});
