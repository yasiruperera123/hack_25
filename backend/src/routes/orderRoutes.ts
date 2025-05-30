import express from 'express';
import { auth, authorize } from '../middleware/auth';
import {
  createOrder,
  getUserOrders,
  getOrderDetails,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderAnalytics
} from '../controllers/orderController';

const router = express.Router();

// Customer routes
router.use(auth); // Apply authentication to all routes
router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderDetails);
router.post('/:id/cancel', cancelOrder);

// Admin routes
router.get('/admin/orders', authorize('admin'), getAllOrders);
router.put('/admin/orders/:id/status', authorize('admin'), updateOrderStatus);
router.get('/admin/orders/analytics', authorize('admin'), getOrderAnalytics);

export default router; 