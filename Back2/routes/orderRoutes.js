// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
  deleteOrder,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.route('/').post(protect, createOrder);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

// Admin routes
router.route('/').get(protect, admin, getOrders);
router.route('/stats').get(protect, admin, getOrderStats);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/:id/status').put(protect, admin, updateOrderStatus);
router.route('/:id').delete(protect, admin, deleteOrder);

module.exports = router;