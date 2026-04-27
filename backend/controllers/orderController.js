/**
 * controllers/orderController.js — Order placement and management
 * Rewritten for Prisma
 */

const prisma = require('../lib/prisma');

// ─── POST /api/orders ─────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    const { fullName, address, city, postalCode, country } = shippingAddress || {};

    if (!fullName || !address || !city || !postalCode || !country) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }

    // Fetch cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals
    const itemsTotal    = cart.items.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);
    const shippingPrice = itemsTotal > 8000 ? 0 : 199;
    const taxPrice      = parseFloat((itemsTotal * 0.08).toFixed(2));
    const totalPrice    = parseFloat((itemsTotal + shippingPrice + taxPrice).toFixed(2));

    // Create order with items in a transaction-like operation
    const order = await prisma.order.create({
      data: {
        userId:             req.user.id,
        paymentMethod:      paymentMethod || 'Card',
        itemsTotal:         parseFloat(itemsTotal.toFixed(2)),
        shippingPrice,
        taxPrice,
        totalPrice,
        isPaid:             true,
        paidAt:             new Date(),
        status:             'pending',
        shippingFullName:   fullName,
        shippingAddress:    address,
        shippingCity:       city,
        shippingPostalCode: postalCode,
        shippingCountry:    country,
        items: {
          createMany: {
            data: cart.items.map((item) => ({
              productId: item.productId,
              name:      item.product.name,
              image:     item.product.image,
              price:     item.price,
              quantity:  item.quantity,
            })),
          },
        },
      },
      include: { items: true },
    });

    // Decrement stock for each product
    for (const item of cart.items) {
      await prisma.product.update({
        where:   { id: item.productId },
        data:    { countInStock: item.product.countInStock - item.quantity },
      });
    }

    // Clear cart items
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/orders/my ───────────────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where:   { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/orders/:id ──────────────────────────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: req.params.id },
      include: {
        user:  { select: { id: true, name: true, email: true } },
        items: true,
      },
    });

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only owner or admin can view
    if (order.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/orders  (Admin only) ───────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user:  { select: { id: true, name: true, email: true } },
        items: true,
      },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/orders/:id/status  (Admin only) ────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const updates = { status };
    if (status === 'DELIVERED') {
      updates.isDelivered = true;
      updates.deliveredAt = new Date();
    }

    const updated = await prisma.order.update({
      where:  { id: req.params.id },
      data:   updates,
      include: { items: true },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
