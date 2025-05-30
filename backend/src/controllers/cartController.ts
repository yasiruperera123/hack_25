import { Response } from 'express';
import { Cart, ICart, ICartItem } from '../models/Cart';
import { Product, IProduct } from '../models/Product';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Get user's cart
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    let cart = await Cart.findOne({ user: req.user._id, status: 'active' })
      .populate('items.product');

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        status: 'active',
      });
    }

    res.json({ cart });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Add item to cart
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { productId, quantity = 1 } = req.body;

    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check stock
    if (!product.isInStock(quantity)) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ user: req.user._id, status: 'active' });
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
        status: 'active',
      });
    }

    // Add item to cart
    await cart.addItem(productId, quantity);
    await cart.populate('items.product');

    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: 'Failed to add item to cart' });
  }
};

// Update cart item quantity
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { itemId } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Invalid quantity' });
    }

    const cart = await Cart.findOne({ user: req.user._id, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find item in cart
    const cartItem = cart.items.find(item => item.product.toString() === itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Check stock
    const product = await Product.findById(cartItem.product);
    if (!product || !product.isInStock(quantity)) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    // Update quantity
    await cart.updateQuantity(cartItem.product.toString(), quantity);
    await cart.populate('items.product');

    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update cart item' });
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find item in cart
    const cartItem = cart.items.find(item => item.product.toString() === itemId);
    if (!cartItem) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Remove item
    await cart.removeItem(cartItem.product.toString());
    await cart.populate('items.product');

    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: 'Failed to remove item from cart' });
  }
};

// Clear cart
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const cart = await Cart.findOne({ user: req.user._id, status: 'active' });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    cart.items = [];
    await cart.save();
    await cart.populate('items.product');

    res.json({ cart });
  } catch (error) {
    res.status(400).json({ error: 'Failed to clear cart' });
  }
};

// Get cart total
export const getCartTotal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const cart = await Cart.findOne({ user: req.user._id, status: 'active' });
    if (!cart) {
      return res.json({
        subtotal: 0,
        tax: 0,
        shipping: 0,
        total: 0,
      });
    }

    res.json({
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate cart total' });
  }
};

// Merge guest cart with user cart
export const mergeGuestCart = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { guestCartId } = req.body;
    if (!guestCartId) {
      return res.status(400).json({ error: 'Guest cart ID is required' });
    }

    // Get guest cart
    const guestCart = await Cart.findOne({ _id: guestCartId, status: 'active' });
    if (!guestCart) {
      return res.status(404).json({ error: 'Guest cart not found' });
    }

    // Get user cart
    let userCart = await Cart.findOne({ user: req.user._id, status: 'active' });
    if (!userCart) {
      userCart = new Cart({
        user: req.user._id,
        items: [],
        status: 'active',
      });
    }

    // Merge items
    for (const guestItem of guestCart.items) {
      const existingItem = userCart.items.find(
        item => item.product.toString() === guestItem.product.toString()
      );

      if (existingItem) {
        // Update quantity if item exists
        await userCart.updateQuantity(
          guestItem.product.toString(),
          existingItem.quantity + guestItem.quantity
        );
      } else {
        // Add new item
        await userCart.addItem(guestItem.product.toString(), guestItem.quantity);
      }
    }

    // Delete guest cart
    await guestCart.deleteOne();

    await userCart.populate('items.product');
    res.json({ cart: userCart });
  } catch (error) {
    res.status(400).json({ error: 'Failed to merge carts' });
  }
}; 