/**
 * models/Product.js — Sequelize Product model
 */

const { DataTypes } = require('sequelize');
const sequelize     = require('../config/db');

const Product = sequelize.define(
  'Product',
  {
    id: {
      type:         DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:   true,
    },
    name: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate:  { notEmpty: { msg: 'Product name is required' } },
    },
    price: {
      type:      DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate:  {
        min: { args: [0], msg: 'Price cannot be negative' },
      },
    },
    description: {
      type:      DataTypes.TEXT,
      allowNull: false,
      validate:  { notEmpty: { msg: 'Description is required' } },
    },
    category: {
      type:      DataTypes.ENUM('Electronics', 'Clothing', 'Accessories', 'Home', 'Other'),
      allowNull: false,
      validate:  { notEmpty: { msg: 'Category is required' } },
    },
    image: {
      type:         DataTypes.STRING,
      defaultValue: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&q=80',
    },
    countInStock: {
      type:         DataTypes.INTEGER,
      allowNull:    false,
      defaultValue: 0,
      validate:     { min: { args: [0], msg: 'Stock cannot be negative' } },
    },
    rating: {
      type:         DataTypes.DECIMAL(3, 2),
      defaultValue: 0,
      validate:     { min: 0, max: 5 },
    },
    numReviews: {
      type:         DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName:  'products',
    timestamps: true,
    indexes: [
      { fields: ['category'] },
      { fields: ['name'] },
    ],
  }
);

module.exports = Product;
