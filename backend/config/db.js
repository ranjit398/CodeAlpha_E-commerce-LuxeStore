/**
 * config/db.js — Sequelize connection setup
 *
 * Supports two config styles:
 *   Option A — DATABASE_URL  (single connection string, great for cloud hosts)
 *   Option B — DB_HOST / DB_PORT / DB_NAME / DB_USER / DB_PASSWORD  (individual vars)
 *
 * Usage:
 *   const sequelize = require('./config/db');
 *   await sequelize.authenticate();   // test connection
 *   await sequelize.sync();           // sync models (use migrate.js instead in prod)
 */

const { Sequelize } = require('sequelize');

// ─── Build Sequelize instance ──────────────────────────────────────────────────

let sequelize;

const dialectOptions =
  process.env.DB_SSL === 'true'
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {};

if (process.env.DATABASE_URL) {
  // Option A — connection string
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
} else {
  // Option B — individual fields
  sequelize = new Sequelize(
    process.env.DB_NAME     || 'luxestore',
    process.env.DB_USER     || 'postgres',
    String(process.env.DB_PASSWORD || ''),
    {
      host:    process.env.DB_HOST || 'localhost',
      port:    parseInt(process.env.DB_PORT, 10) || 5432,
      dialect: 'postgres',
      dialectOptions,
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
    }
  );
}

module.exports = sequelize;
