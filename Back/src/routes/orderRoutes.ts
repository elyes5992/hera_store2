// src/routes/orderRoutes.ts
import express from 'express';
import { 
  getOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  deleteOrder
} from '../controllers/orderController';
import { protect, authorize } from '../Middlerware/auth';

const router = express.Router();

// Protected routes
router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

// Admin routes
router.get('/', protect, authorize('admin'), getOrders);
router.put('/:id/deliver', protect, authorize('admin'), updateOrderToDelivered);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

export default router;