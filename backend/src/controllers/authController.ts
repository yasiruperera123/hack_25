import { Response } from 'express';
import { User } from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Register new user
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password, phoneNumber } = req.body as {
      name: string;
      email: string;
      password: string;
      phoneNumber?: string;
    };

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phoneNumber,
      role: 'customer',
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: 'Registration successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' });
  }
};

// Login user
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ error: 'Login failed' });
  }
};

// Get user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: 'Failed to get profile' });
  }
};

// Update user profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'phoneNumber', 'addresses'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    updates.forEach(update => {
      if (req.user) {
        req.user[update] = req.body[update];
      }
    });
    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: req.user,
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update profile' });
  }
};

// Change password
export const changePassword = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const { currentPassword, newPassword } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    // Verify current password
    const isMatch = await req.user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to change password' });
  }
};

// Request password reset
export const requestPasswordReset = async (req: AuthRequest, res: Response) => {
  try {
    const { email } = req.body as { email: string };
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate reset token
    const resetToken = generateToken(user._id.toString());

    // TODO: Send reset email with token
    // For now, just return the token
    res.json({
      message: 'Password reset instructions sent to email',
      resetToken,
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to process password reset request' });
  }
};

// Reset password
export const resetPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { token, newPassword } = req.body as {
      token: string;
      newPassword: string;
    };

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { _id: string };
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to reset password' });
  }
}; 