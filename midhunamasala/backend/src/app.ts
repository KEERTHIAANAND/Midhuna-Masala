import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

import { env } from './config/env';

// Routes
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import cartRoutes from './routes/cart.routes';
import addressesRoutes from './routes/addresses.routes';
import ordersRoutes from './routes/orders.routes';
import inventoryRoutes from './routes/inventory.routes';

const app = express();
const PORT = env.PORT ?? 5000;

// Running behind Render/Cloudflare/etc. proxies — makes req.ip accurate (rate limiting)
// and avoids issues if you later add secure cookies.
app.set('trust proxy', 1);

/* ════════════════════════════════════
   Middleware
   ════════════════════════════════════ */

// Security headers
app.use(helmet());

// CORS — allow frontend origin
const corsOrigins = (env.CORS_ORIGIN || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

function isOriginAllowed(origin: string): boolean {
    if (corsOrigins.includes(origin)) return true;

    // Support wildcard subdomains in env, e.g.
    // - https://*.midhunamasala.pages.dev
    // - *.midhunamasala.pages.dev
    // - .midhunamasala.pages.dev  (treated as suffix match)
    let originUrl: URL;
    try {
        originUrl = new URL(origin);
    } catch {
        return false;
    }

    return corsOrigins.some((pattern) => {
        const trimmed = pattern.trim();
        if (!trimmed) return false;

        // Exact match already handled above
        if (trimmed === origin) return true;

        // If pattern includes protocol, enforce protocol match
        let patternProtocol: string | undefined;
        let patternHost = trimmed;
        if (trimmed.includes('://')) {
            try {
                const parsed = new URL(trimmed.replace('*.', 'wildcard.'));
                patternProtocol = parsed.protocol;
                patternHost = parsed.host;
            } catch {
                return false;
            }
        }

        if (patternProtocol && originUrl.protocol !== patternProtocol) return false;

        // Normalize wildcard host parsing
        // - "*.example.com" allows any subdomain (a.example.com)
        // - ".example.com" allows any suffix match (a.example.com, b.a.example.com)
        // - "example.com" exact host match only
        const originHost = originUrl.host;
        if (patternHost.startsWith('wildcard.')) {
            const base = patternHost.replace(/^wildcard\./, '');
            return originHost === base || originHost.endsWith(`.${base}`);
        }

        if (patternHost.startsWith('*.')) {
            const base = patternHost.slice(2);
            return originHost === base || originHost.endsWith(`.${base}`);
        }

        if (patternHost.startsWith('.')) {
            const base = patternHost.slice(1);
            return originHost === base || originHost.endsWith(`.${base}`);
        }

        // If pattern has no protocol and no wildcard, treat it as host-only exact match
        if (!trimmed.includes('://') && !trimmed.includes('*')) {
            return originHost === trimmed;
        }

        return false;
    });
}

app.use(
    cors({
        origin: (
            origin: string | undefined,
            callback: (err: Error | null, allow?: boolean) => void
        ) => {
            // Allow non-browser requests (health checks, curl, etc.)
            if (!origin) return callback(null, true);
            if (isOriginAllowed(origin)) return callback(null, true);
            return callback(new Error(`CORS blocked for origin: ${origin}`));
        },
        credentials: true,
    })
);

// Parse JSON body
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use(morgan('dev'));

// Rate limiting — 100 requests per 15 min per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

/* ════════════════════════════════════
   Routes
   ════════════════════════════════════ */

// Root (useful for Render health probes)
app.get('/', (_req: Request, res: Response) => {
    res.status(200).send('OK');
});

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: 'Midhuna Masala API is running!',
        timestamp: new Date().toISOString(),
    });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Products routes
app.use('/api/products', productsRoutes);

// Cart routes
app.use('/api/cart', cartRoutes);

// Addresses routes
app.use('/api/addresses', addressesRoutes);

// Orders routes
app.use('/api/orders', ordersRoutes);
// Inventory routes (admin)
app.use('/api/inventory', inventoryRoutes);
/* ════════════════════════════════════
   Error Handling
   ════════════════════════════════════ */
app.use(errorHandler);

// 404 handler
app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, error: 'Route not found.' });
});

/* ════════════════════════════════════
   Start Server
   ════════════════════════════════════ */
app.listen(PORT, () => {
    console.log(`\n🌶️  Midhuna Masala API Server`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
    console.log(`   CORS origin: ${env.CORS_ORIGIN || 'http://localhost:3000'}\n`);
});

export default app;
