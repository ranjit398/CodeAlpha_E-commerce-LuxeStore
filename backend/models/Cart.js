/**
 * models/Cart.js — Sequelize Cart model
 *
 * Each user has exactly one Cart (1-to-1).
 * Cart items live in the CartItem table.
 *
 * Associations defined here:
 *   Cart.belongsTo(User)
 *   Cart.hasMany(CartItem)
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const User          = require('./User');

const Cart = sequelize.define(
  'Cart',
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    // userId foreign key is added automatically by the association below
  },
  {
    tableName:  'carts',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['userId'] },
    ],
  }
);

// ─── Associations ─────────────────────────────────────────────────────────────

// Cart belongs to a User — adds userId FK to carts table
Cart.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
User.hasOne(Cart,    { foreignKey: 'userId' });

module.exports = Cart;
