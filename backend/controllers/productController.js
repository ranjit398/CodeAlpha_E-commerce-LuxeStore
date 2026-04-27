/**
 * controllers/productController.js — Product CRUD
 * Rewritten for Prisma
 */

const prisma = require('../lib/prisma');

// ─── GET /api/products ────────────────────────────────────────────────────────
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, page = 1, limit = 12 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));

    // ── WHERE clause ──
    const where = {};
    if (category && category !== 'All') {
      where.category = category;
    }
    if (search) {
      // case-insensitive search on product name
      where.name = { contains: search, mode: 'insensitive' };
    }

    // ── ORDER BY ──
    let orderBy = { createdAt: 'desc' };
    if (sort === 'price-asc') orderBy = { price: 'asc' };
    else if (sort === 'price-desc') orderBy = { price: 'desc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    // ── Pagination ──
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── GET /api/products/:id ────────────────────────────────────────────────────
const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ─── POST /api/products  (Admin only) ─────────────────────────────────────────
const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, countInStock } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: 'name, price, description, and category are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        description,
        category,
        image: image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600&q=80',
        countInStock: countInStock || 0,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── PUT /api/products/:id  (Admin only) ──────────────────────────────────────
const updateProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ─── DELETE /api/products/:id  (Admin only) ───────────────────────────────────
const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
