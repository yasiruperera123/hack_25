import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Order, IOrder } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import mongoose from 'mongoose';

// Create order from cart
export const createOrder = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { shippingAddress, paymentInfo, notes } = req.body;

    // Get user's active cart
    const cart = await Cart.findOne({ user: req.user._id, status: 'active' })
      .populate('items.product')
      .session(session);

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      const product = await Product.findById(item.product).session(session);
      if (!product || !product.isInStock(item.quantity)) {
        await session.abortTransaction();
        return res.status(400).json({ 
          error: `Insufficient stock for ${product?.name || 'product'}` 
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: cart.items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      paymentInfo,
      notes,
      status: 'pending',
      subtotal: cart.subtotal,
      tax: cart.tax,
      shipping: cart.shipping,
      total: cart.total
    });

    // Deduct stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }

    // Save order and update cart status
    await order.save({ session });
    cart.status = 'converted';
    await cart.save({ session });

    await session.commitTransaction();
    res.status(201).json({ order });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    session.endSession();
  }
};

// Get user's order history
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('items.product');

    const total = await Order.countDocuments({ user: req.user._id });

    res.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Get order details
export const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order details' });
  }
};

// Cancel order
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      status: { $in: ['pending', 'processing'] }
    }).session(session);

    if (!order) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Order not found or cannot be cancelled' });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: item.quantity } },
        { session }
      );
    }

    // Update order status
    order.status = 'cancelled';
    await order.save({ session });

    await session.commitTransaction();
    res.json({ order });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: 'Failed to cancel order' });
  } finally {
    session.endSession();
  }
};

// Admin: Get all orders with filtering
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const {
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10
    } = req.query;

    const query: any = {};
    if (status) query.status = status;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate('items.product')
      .populate('user', 'name email');

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

// Admin: Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        ...(status === 'shipped' && { 
          trackingNumber: req.body.trackingNumber,
          estimatedDelivery: req.body.estimatedDelivery
        })
      },
      { new: true }
    ).populate('items.product');

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
};

// Admin: Get order analytics
export const getOrderAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { startDate, endDate } = req.query;
    const query: any = {};

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate as string);
      if (endDate) query.createdAt.$lte = new Date(endDate as string);
    }

    const [
      totalOrders,
      totalRevenue,
      statusCounts,
      dailyOrders,
      topProducts
    ] = await Promise.all([
      Order.countDocuments(query),
      Order.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: query },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 },
            revenue: { $sum: '$total' }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: query },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalQuantity: { $sum: '$items.quantity' },
            totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' }
      ])
    ]);

    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      statusCounts: statusCounts.reduce((acc: any, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      dailyOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order analytics' });
  }
}; 