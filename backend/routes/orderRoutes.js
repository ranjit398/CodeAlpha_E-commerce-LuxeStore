const express = require('express');
const router  = express.Router();
const {
  createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect); // All order routes require auth

router.post('/',             createOrder);
router.get('/my',            getMyOrders);
router.get('/:id',           getOrderById);
router.get('/',              adminOnly, getAllOrders);
router.put('/:id/status',    adminOnly, updateOrderStatus);

module.exports = router;
