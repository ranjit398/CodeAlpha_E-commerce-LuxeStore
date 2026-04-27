/**
 * routes/adminRoutes.js — Admin dashboard endpoints
 */

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getUsers, getOrders, getStats, deleteUser, updateOrderStatus } = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// ─── Admin endpoints ──────────────────────────────────────────────────────────
router.get('/users',       getUsers);           // All users with login history
router.get('/orders',      getOrders);          // All orders
router.get('/stats',       getStats);           // Dashboard stats
router.delete('/users/:id',  deleteUser);       // Delete a user
router.patch('/orders/:id',  updateOrderStatus); // Update order status

module.exports = router;
