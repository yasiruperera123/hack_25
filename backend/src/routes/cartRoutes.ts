import express from 'express';
import { auth } from '../middleware/auth';
import { validateAddToCart, validateUpdateQuantity, validateItemId } from '../middleware/cartValidation';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartTotal,
  mergeGuestCart
} from '../controllers/cartController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(auth);

// Cart routes with validation
router.get('/', getCart);
router.post('/add', validateAddToCart, addToCart);
router.put('/update/:itemId', validateItemId, validateUpdateQuantity, updateCartItem);
router.delete('/remove/:itemId', validateItemId, removeFromCart);
router.delete('/clear', clearCart);
router.get('/total', getCartTotal);
router.post('/merge', validateAddToCart, mergeGuestCart);

export default router; 