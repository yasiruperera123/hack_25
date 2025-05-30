import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';

// Validation schemas
const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be a positive number'),
});

const updateQuantitySchema = z.object({
  quantity: z.number().int().positive('Quantity must be a positive number'),
});

// Validation middleware
export const validateAddToCart = (req: Request, res: Response, next: NextFunction) => {
  try {
    cartItemSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

export const validateUpdateQuantity = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateQuantitySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: error.errors.map((err: z.ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

export const validateItemId = (req: Request, res: Response, next: NextFunction) => {
  const { itemId } = req.params;
  if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid item ID'
    });
  }
  next();
}; 