/**
 * controllers/cartController.js — Persistent cart management
 * Rewritten for Prisma
 */

const prisma = require('../lib/prisma');

// ─── Helper: fetch a fully-populated cart + computed totalPrice ───────────────
const getPopulatedCart = async (userId) => {
  const cart = await prisma.cart.findUnique({
    where:   { userId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) return { id: null, userId, items: [], totalPrice: 0, createdAt: new Date(), updatedAt: new Date() };

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return { 
    ...cart, 
    CartItems: cart.items,  // Map to Sequelize naming for frontend compatibility
    totalPrice: parseFloat(totalPrice.toFixed(2)) 
  };
};

// ─── GET /api/cart ────────────────────────────────────────────────────────────
const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user.id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/cart ───────────────────────────────────────────────────────────
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const qty = Number(quantity);

    // Validate product and stock
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.countInStock < qty) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Get or create cart for this user
    let cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: req.user.id } });
    }

    // Get or create cart item
    let cartItem = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    });

    if (cartItem) {
      // Item already exists — increment quantity
      cartItem = await prisma.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity: cartItem.quantity + qty },
      });
    } else {
      // Create new item
      cartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: qty,
          price: product.price,
        },
      });
    }

    const updatedCart = await getPopulatedCart(req.user.id);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── PUT /api/cart/:itemId ────────────────────────────────────────────────────
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const qty = Number(quantity);

    // Verify the cart item belongs to this user's cart
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
    });
    if (!item || item.cartId !== cart.id) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (qty <= 0) {
      await prisma.cartItem.delete({ where: { id: item.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: qty },
      });
    }

    const updatedCart = await getPopulatedCart(req.user.id);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/cart/:itemId ─────────────────────────────────────────────────
const removeFromCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = await prisma.cartItem.findUnique({
      where: { id: req.params.itemId },
    });
    if (!item || item.cartId !== cart.id) return res.status(404).json({ message: 'Cart item not found' });

    await prisma.cartItem.delete({ where: { id: item.id } });

    const updatedCart = await getPopulatedCart(req.user.id);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── DELETE /api/cart ─────────────────────────────────────────────────────────
const clearCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findUnique({ where: { userId: req.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    }
    res.json({ message: 'Cart cleared', items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
