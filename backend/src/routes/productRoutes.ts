import express from 'express';
import {
  getProducts,
  getProductById,
  getCategories,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from '../controllers/productController';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/search', searchProducts);
router.get('/:id', getProductById);

// Admin routes
router.post('/', auth, authorize('admin'), createProduct);
router.put('/:id', auth, authorize('admin'), updateProduct);
router.delete('/:id', auth, authorize('admin'), deleteProduct);
router.put('/:id/stock', auth, authorize('admin'), updateStock);

export default router; 