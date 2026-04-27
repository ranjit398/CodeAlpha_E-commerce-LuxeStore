/**
 * controllers/authController.js — Register, login, and profile
 * Rewritten for Prisma + PostgreSQL
 */

const jwt    = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

// ─── Helper ───────────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const toSafeJSON = (user) => {
  const { password, ...safe } = user;
  return safe;
};

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check for existing account
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      user:  toSafeJSON(user),
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login time
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    res.json({
      user:  toSafeJSON(updatedUser),
      token: generateToken(updatedUser.id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/auth/profile ────────────────────────────────────────────────────
// req.user is attached by the protect middleware — password already stripped
const getProfile = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getProfile };
