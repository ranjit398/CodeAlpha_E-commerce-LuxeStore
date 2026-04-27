/**
 * config/seed.js — Seeds the database with sample products and an admin user
 *
 * Run with:  npm run seed
 *
 * ⚠️  This will DELETE existing products and recreate sample data.
 */

const dotenv = require('dotenv');
dotenv.config();

const bcrypt = require('bcryptjs');
const prisma = require('../lib/prisma');

// ─── Sample products ──────────────────────────────────────────────────────────
const products = [
  // Accessories
  {
    name:         'Minimalist Leather Watch',
    price:        20750,
    description:  'A timeless piece crafted from genuine Italian leather with a Swiss quartz movement. The slim profile and clean dial make it perfect for both casual and formal occasions.',
    category:     'Accessories',
    image:        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    countInStock: 15, rating: 4.8, numReviews: 124,
  },
  {
    name:         'Titanium Aviator Sunglasses',
    price:        12450,
    description:  'Ultra-lightweight titanium frames with polarized crystal lenses. Hand-finished in Japan for unparalleled precision and comfort.',
    category:     'Accessories',
    image:        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80',
    countInStock: 10, rating: 4.7, numReviews: 86,
  },
  {
    name:         'Full-Grain Leather Briefcase',
    price:        32000,
    description:  'Professional briefcase handmade from premium full-grain leather. Develops a beautiful patina over time. Features dedicated padded compartment for 16" laptops.',
    category:     'Accessories',
    image:        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    countInStock: 5, rating: 4.9, numReviews: 42,
  },

  // Electronics
  {
    name:         'Wireless Noise-Cancelling Headphones',
    price:        29050,
    description:  'Experience pure audio bliss with 40-hour battery life, adaptive noise cancellation, and premium drivers tuned by world-class audio engineers.',
    category:     'Electronics',
    image:        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    countInStock: 8, rating: 4.9, numReviews: 289,
  },
  {
    name:         'Mechanical Studio Keyboard',
    price:        18900,
    description:  'Heavyweight aluminum chassis with hot-swappable switches and PBT keycaps. Designed for the ultimate typing experience and desktop aesthetics.',
    category:     'Electronics',
    image:        'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=600&q=80',
    countInStock: 12, rating: 4.8, numReviews: 156,
  },
  {
    name:         'Professional Mirrorless Camera',
    price:        145000,
    description:  '45MP full-frame sensor capable of 8K video. The choice of professionals for high-speed action and landscape photography alike.',
    category:     'Electronics',
    image:        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    countInStock: 3, rating: 5.0, numReviews: 28,
  },

  // Clothing
  {
    name:         'Cashmere Blend Sweater',
    price:        15770,
    description:  'Ultra-soft cashmere blend sweater featuring a relaxed fit and ribbed cuffs. Available in timeless neutral tones for effortless styling.',
    category:     'Clothing',
    image:        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
    countInStock: 22, rating: 4.6, numReviews: 87,
  },
  {
    name:         'Merino Wool Overcoat',
    price:        45000,
    description:  'Classic tailored overcoat made from 100% fine Merino wool. Elegant drape and exceptional warmth for the discerning gentleman.',
    category:     'Clothing',
    image:        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80',
    countInStock: 7, rating: 4.9, numReviews: 31,
  },
  {
    name:         'Raw Denim Selvedge Jeans',
    price:        11500,
    description:  '14oz Japanese selvedge denim, indigo dyed. Designed to break in uniquely to your lifestyle. Classic straight cut.',
    category:     'Clothing',
    image:        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    countInStock: 15, rating: 4.7, numReviews: 94,
  },

  // Home & Furniture
  {
    name:         'Mid-Century Walnut Lounge Chair',
    price:        89000,
    description:  'Iconic design featuring a molded walnut plywood shell and premium top-grain leather upholstery. A masterpiece of modern furniture.',
    category:     'Furniture',
    image:        'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&q=80',
    countInStock: 4, rating: 4.9, numReviews: 18,
  },
  {
    name:         'Hand-Knotted Wool Rug',
    price:        56000,
    description:  'Traditional Persian pattern reimagined in contemporary neutral tones. Hand-knotted over 4 months by master artisans.',
    category:     'Home',
    image:        'https://images.unsplash.com/photo-1531835551805-16d864c8d311?w=600&q=80',
    countInStock: 2, rating: 4.8, numReviews: 12,
  },
  {
    name:         'Solid Walnut Dining Table',
    price:        125000,
    description:  'Clean lines and natural beauty. This table is made from sustainably sourced solid walnut with traditional mortise and tenon joinery.',
    category:     'Furniture',
    image:        'https://images.unsplash.com/photo-1577140917170-285929fb55b7?w=600&q=80',
    countInStock: 3, rating: 4.7, numReviews: 22,
  },

  // Fragrance & Wellness
  {
    name:         'Oud Wood Eau de Parfum',
    price:        18500,
    description:  'A rare and exotic blend of smoky oud, sandalwood, and spices. A deep, mysterious scent that leaves a lasting impression.',
    category:     'Fragrance',
    image:        'https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80',
    countInStock: 20, rating: 4.8, numReviews: 112,
  },
  {
    name:         'Essential Oil Stone Diffuser',
    price:        8900,
    description:  'Hand-crafted porcelain diffuser that scents your space naturally. Features silent ultrasonic technology and a warm ambient glow.',
    category:     'Wellness',
    image:        'https://images.unsplash.com/photo-1602928294221-441f23d831fe?w=600&q=80',
    countInStock: 25, rating: 4.6, numReviews: 78,
  },

  // Footwear
  {
    name:         'Handcrafted Chelsea Boots',
    price:        24500,
    description:  'Classic silhouette made from premium Italian suede with a durable Goodyear welt construction. Comfort meets timeless style.',
    category:     'Footwear',
    image:        'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&q=80',
    countInStock: 12, rating: 4.7, numReviews: 56,
  },
  {
    name:         'Minimalist White Leather Sneakers',
    price:        14000,
    description:  'Clean, essential sneakers made from buttery soft calfskin leather. Margom rubber sole and calfskin lining for ultimate comfort.',
    category:     'Footwear',
    image:        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
    countInStock: 30, rating: 4.8, numReviews: 245,
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────
const seedDB = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // Clear existing data in correct order (respecting foreign keys)
    console.log('🗑️  Clearing existing data...');
    await prisma.orderItem.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.cartItem.deleteMany({});
    await prisma.cart.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Database cleared\n');

    // Insert products
    await prisma.product.createMany({ data: products });
    console.log(`✅ Seeded ${products.length} products`);

    // Create demo admin
    const hashed = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        name:     'Admin User',
        email:    'admin@luxestore.com',
        password: hashed,
        role:     'admin',
      },
    });
    console.log('👤 Created admin user: admin@luxestore.com / admin123');

    console.log('\n✨ Database seeded successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDB();
