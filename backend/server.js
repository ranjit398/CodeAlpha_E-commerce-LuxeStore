/**
 * server.js — Main Express application entry point
 * Using PostgreSQL via Prisma ORM
 */

const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const prisma    = require('./lib/prisma');

dotenv.config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/cart',     require('./routes/cartRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/admin',    require('./routes/adminRoutes'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', message: 'LuxeStore API is running', db: 'PostgreSQL connected' });
  } catch {
    res.status(503).json({ status: 'error', message: 'Database unreachable' });
  }
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Verify DB is reachable before accepting requests
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ PostgreSQL connected');

    app.listen(PORT, () => {
      console.log(`\n🚀 LuxeStore API running on http://localhost:${PORT}`);
      console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️  Database:    PostgreSQL via Prisma\n`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();
