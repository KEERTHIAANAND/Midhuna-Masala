import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';

// Routes
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import cartRoutes from './routes/cart.routes';
import addressesRoutes from './routes/addresses.routes';
import ordersRoutes from './routes/orders.routes';

const app = express();
const PORT = process.env.PORT || 5000;

/* ════════════════════════════════════
   Middleware
   ════════════════════════════════════ */

// Security headers
app.use(helmet());

// CORS — allow frontend origin
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
}));

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

// Health check
app.get('/api/health', (_req, res) => {
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

/* ════════════════════════════════════
   Error Handling
   ════════════════════════════════════ */
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Route not found.' });
});

/* ════════════════════════════════════
   Start Server
   ════════════════════════════════════ */
app.listen(PORT, () => {
    console.log(`\n🌶️  Midhuna Masala API Server`);
    console.log(`   Running on: http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}\n`);
});

export default app;
