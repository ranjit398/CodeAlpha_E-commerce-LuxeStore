/**
 * models/CartItem.js — Sequelize CartItem model  (split from Cart)
 *
 * Each row represents one product line inside a cart.
 *
 * Associations:
 *   CartItem.belongsTo(Cart)
 *   CartItem.belongsTo(Product)
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const Cart          = require('./Cart');
const Product       = require('./Product');

const CartItem = sequelize.define(
  'CartItem',
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    quantity: {
      type:         DataTypes.INTEGER,
      allowNull:    false,
      defaultValue: 1,
      validate:     { min: { args: [1], msg: 'Quantity must be at least 1' } },
    },
    price: {
      // Snapshot of the product price at the time it was added
      type:      DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    tableName:  'cart_items',
    timestamps: true,
    indexes: [
      { fields: ['cartId'] },
      { unique: true, fields: ['cartId', 'productId'] }, // one row per product per cart
    ],
  }
);

// ─── Associations ─────────────────────────────────────────────────────────────

CartItem.belongsTo(Cart,    { foreignKey: { name: 'cartId',    allowNull: false }, onDelete: 'CASCADE'  });
CartItem.belongsTo(Product, { foreignKey: { name: 'productId', allowNull: false }, onDelete: 'CASCADE'  });

Cart.hasMany(CartItem,    { foreignKey: 'cartId',    onDelete: 'CASCADE'  });
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'CASCADE'  });

module.exports = CartItem;
