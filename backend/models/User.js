/**
 * models/User.js — Sequelize User model
 *
 * Features:
 *   - Password hashed via beforeSave hook (bcrypt)
 *   - matchPassword() instance method for login
 *   - toSafeJSON()   instance method — returns user object without password
 */

const { DataTypes } = require('sequelize');
const bcrypt        = require('bcryptjs');
const sequelize     = require('../config/db');

const User = sequelize.define(
  'User',
  {
    id: {
      type:          DataTypes.UUID,
      defaultValue:  DataTypes.UUIDV4,
      primaryKey:    true,
    },
    name: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate:  {
        notEmpty: { msg: 'Name is required' },
        len:      { args: [2, 100], msg: 'Name must be 2–100 characters' },
      },
    },
    email: {
      type:      DataTypes.STRING,
      allowNull: false,
      unique:    true,
      validate:  {
        isEmail:  { msg: 'Please enter a valid email' },
        notEmpty: { msg: 'Email is required' },
      },
    },
    password: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate:  {
        len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
      },
    },
    role: {
      type:         DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user',
    },
  },
  {
    tableName:  'users',
    timestamps: true,
    indexes: [
      { unique: true, fields: ['email'] },
    ],
  }
);

// ─── Hooks ────────────────────────────────────────────────────────────────────

// Hash password before any create or update that touches the password field
User.addHook('beforeSave', async (user) => {
  if (user.changed('password')) {
    const salt   = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// ─── Instance methods ─────────────────────────────────────────────────────────

/**
 * Compare a plain-text password against the stored hash.
 * @param {string} enteredPassword
 * @returns {Promise<boolean>}
 */
User.prototype.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

/**
 * Return a plain object with the password field removed.
 * Use this instead of toJSON() so the password is never sent to clients.
 * @returns {object}
 */
User.prototype.toSafeJSON = function () {
  const { password, ...safe } = this.get({ plain: true });
  return safe;
};

module.exports = User;
