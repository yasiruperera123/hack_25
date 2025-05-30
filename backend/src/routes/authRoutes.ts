import express from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  requestPasswordReset,
  resetPassword,
} from '../controllers/authController';
import { auth, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

// Admin only routes
router.get('/admin/users', auth, authorize('admin'), (req, res) => {
  // TODO: Implement admin user list endpoint
  res.json({ message: 'Admin user list endpoint' });
});

export default router; 