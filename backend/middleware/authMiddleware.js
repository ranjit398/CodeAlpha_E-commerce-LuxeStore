/**
 * middleware/authMiddleware.js — JWT authentication & admin guard
 * Updated: uses Prisma User.findUnique() instead of Sequelize/Mongoose
 */

const jwt    = require('jsonwebtoken');
const prisma = require('../lib/prisma');

/**
 * protect — verifies JWT and attaches the safe user object to req.user
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token   = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user — exclude password
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true, updatedAt: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach plain object to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

/**
 * adminOnly — restricts route to users with role === 'admin'
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Admin access required' });
};

module.exports = { protect, adminOnly };
