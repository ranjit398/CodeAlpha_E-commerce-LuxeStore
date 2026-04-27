/**
 * models/Order.js — Sequelize Order model
 *
 * Shipping address is stored as flat (denormalised) columns — no sub-table needed.
 *
 * Associations:
 *   Order.belongsTo(User)
 *   Order.hasMany(OrderItem)
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const User          = require('./User');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },

    // ─── Pricing ──────────────────────────────────────────────────────────────
    itemsTotal: {
      type:      DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    shippingPrice: {
      type:         DataTypes.DECIMAL(10, 2),
      allowNull:    false,
      defaultValue: 0,
    },
    taxPrice: {
      type:         DataTypes.DECIMAL(10, 2),
      allowNull:    false,
      defaultValue: 0,
    },
    totalPrice: {
      type:      DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },

    // ─── Payment ──────────────────────────────────────────────────────────────
    paymentMethod: {
      type:         DataTypes.STRING,
      allowNull:    false,
      defaultValue: 'Card',
    },
    isPaid: {
      type:         DataTypes.BOOLEAN,
      defaultValue: false,
    },
    paidAt: {
      type:         DataTypes.DATE,
      allowNull:    true,
    },

    // ─── Fulfilment ───────────────────────────────────────────────────────────
    status: {
      type:         DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    isDelivered: {
      type:         DataTypes.BOOLEAN,
      defaultValue: false,
    },
    deliveredAt: {
      type:         DataTypes.DATE,
      allowNull:    true,
    },

    // ─── Shipping address (denormalised) ──────────────────────────────────────
    shippingFullName: {
      type:      DataTypes.STRING,
      allowNull: false,
    },
    shippingAddress: {
      type:      DataTypes.STRING,
      allowNull: false,
    },
    shippingCity: {
      type:      DataTypes.STRING,
      allowNull: false,
    },
    shippingPostalCode: {
      type:      DataTypes.STRING,
      allowNull: false,
    },
    shippingCountry: {
      type:      DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName:  'orders',
    timestamps: true,
    indexes: [
      { fields: ['userId'] },
      { fields: ['status'] },
    ],
  }
);

// ─── Associations ─────────────────────────────────────────────────────────────

Order.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' });
User.hasMany(Order,   { foreignKey: 'userId' });

module.exports = Order;
