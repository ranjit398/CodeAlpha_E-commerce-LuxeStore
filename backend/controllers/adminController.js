/**
 * controllers/adminController.js — Admin dashboard data
 */

const prisma = require('../lib/prisma');

// ─── GET /api/admin/users ─────────────────────────────────────────────────────
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        lastLoginAt: true,
        createdAt: true,
        role: true,
        orders: {
          select: {
            id: true,
            createdAt: true,
            totalPrice: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/admin/orders ────────────────────────────────────────────────────
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/admin/stats ─────────────────────────────────────────────────────
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalRevenue, totalProducts] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
      }),
      prisma.product.count(),
    ]);

    res.json({
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        totalProducts,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/admin/users/:id ──────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user (cascade will handle orders, items, cart)
    await prisma.user.delete({ where: { id } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PATCH /api/admin/orders/:id ─────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    // Validate status enum
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Check if order exists
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
      },
    });

    res.json({ message: `Order status updated to ${status}`, order: updatedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, getOrders, getStats, deleteUser, updateOrderStatus };
