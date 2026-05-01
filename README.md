# LuxeStore — Premium E-commerce Platform

**CodeAlpha Internship Project** — A sophisticated, full-stack e-commerce application built with a focus on premium aesthetics, seamless user experience, and robust backend management.

LuxeStore is designed specifically for high-end retail, featuring Indian Rupee (INR) localization and a curated design system.

## ✨ Features

### 🛍️ Shopping Experience
- **Premium Product Catalog**: Grid-based browsing with luxury hover effects and category filtering.
- **Dynamic Product Details**: High-resolution imagery, detailed descriptions, and **Related Products** recommendations.
- **Smart Shopping Cart**: Real-time quantity updates, persistent items, and a one-click "Clear Cart" feature.
- **INR Localization**: All pricing, taxes, and shipping logic are localized to the Indian context (₹).
- **Checkout Flow**: Streamlined checkout process with automated tax calculation and shipping thresholds.

### 🔐 Authentication & Security
- **JWT-Based Auth**: Secure user registration and login.
- **Protected Sessions**: Cart persistence and order history linked to user accounts.
- **Role-Based Access**: Specialized admin routes for platform management.

### 🛠️ Platform Management (Admin)
- **Dashboard**: Real-time stats on revenue, total orders, and user growth.
- **Inventory Control**: Add, edit, and delete products and categories.
- **Order Tracking**: Comprehensive list of all customer orders with status management.
- **User Management**: Overview of registered customers and their spending habits.

## 🚀 Tech Stack

### Frontend
- **React.js**: Functional components with Hooks.
- **Tailwind CSS**: Modern, utility-first styling with a custom luxury color palette.
- **Axios**: Promised-based HTTP client for API communication.
- **Context API**: Global state management for Authentication and Cart.
- **React Hot Toast**: Beautiful, non-intrusive notifications.

### Backend
- **Node.js & Express**: High-performance RESTful API.
- **Prisma ORM**: Type-safe database access and migrations (PostgreSQL).
- **PostgreSQL**: Robust relational database for reliable data persistence.
- **JWT (JSON Web Tokens)**: Secure stateless authentication.
- **Bcrypt.js**: Industry-standard password hashing.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL instance

### 1. Database Configuration
Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/luxestore"
JWT_SECRET="your_secret_key"
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install
npx prisma db push

# Frontend
cd ../frontend
npm install
```

### 3. Seed Sample Data
Populate the store with premium products and a default admin user:
```bash
cd backend
npm run seed
```

### 4. Start the Application
```bash
# Run Backend (http://localhost:5000)
cd backend
npm run dev

# Run Frontend (http://localhost:3000)
cd frontend
npm start
```

## 👤 Admin Credentials
After seeding, you can log in as admin:
- **Email**: `admin@luxestore.com`
- **Password**: `*******`

---
*Created for the CodeAlpha Internship Program.*
