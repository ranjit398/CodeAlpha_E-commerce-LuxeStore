/**
 * models/OrderItem.js — Sequelize OrderItem model  (split from Order)
 *
 * Each row is one product line inside an order.
 * Product name and image are snapshotted so records survive product edits/deletions.
 *
 * Associations:
 *   OrderItem.belongsTo(Order)
 *   OrderItem.belongsTo(Product)
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');
const Order         = require('./Order');
const Product       = require('./Product');

const OrderItem = sequelize.define(
  'OrderItem',
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    // Snapshotted at order time so records survive product edits
    name: {
      type:      DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type:      DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type:      DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    quantity: {
      type:      DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName:  'order_items',
    timestamps: false,        // No need for createdAt/updatedAt on line items
    indexes: [
      { fields: ['orderId'] },
    ],
  }
);

// ─── Associations ─────────────────────────────────────────────────────────────

OrderItem.belongsTo(Order,   { foreignKey: { name: 'orderId',   allowNull: false }, onDelete: 'CASCADE'  });
OrderItem.belongsTo(Product, { foreignKey: { name: 'productId', allowNull: false }, onDelete: 'RESTRICT' });

Order.hasMany(OrderItem,   { foreignKey: 'orderId',   onDelete: 'CASCADE'  });
Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'RESTRICT' });

module.exports = OrderItem;
