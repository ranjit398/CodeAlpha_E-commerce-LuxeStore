/**
 * config/migrate.js — Create / update all database tables
 *
 * Run with:  npm run db:migrate
 *
 * Uses Sequelize's sync({ alter: true }) which:
 *   - Creates tables that don't exist yet
 *   - Adds / modifies columns on existing tables (safe for development)
 *
 * For production prefer a proper migration tool (sequelize-cli or umzug).
 */

const dotenv = require('dotenv');
dotenv.config();

const sequelize = require('./db');

// Import every model so Sequelize is aware of them and can sync their tables.
// Order doesn't matter — associations are set up inside each model file.
require('../models/User');
require('../models/Product');
require('../models/Cart');
require('../models/CartItem');
require('../models/Order');
require('../models/OrderItem');

const migrate = async () => {
  try {
    console.log('🔌 Connecting to PostgreSQL…');
    await sequelize.authenticate();
    console.log('✅ Connection established\n');

    console.log('⚙️  Syncing models to database…');
    await sequelize.sync({ alter: true });

    console.log('\n✅ All tables created / updated successfully!');
    console.log('   Tables: users, products, carts, cart_items, orders, order_items\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

migrate();
