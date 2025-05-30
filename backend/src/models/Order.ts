import mongoose from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

export interface IOrderItem {
  product: IProduct['_id'];
  quantity: number;
  price: number;
  name: string;
}

export interface IAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

export interface IPaymentInfo {
  method: 'credit_card' | 'paypal' | 'stripe';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  amount: number;
  currency: string;
  paidAt?: Date;
}

export interface IOrder extends mongoose.Document {
  user: IUser['_id'];
  items: IOrderItem[];
  shippingAddress: IAddress;
  billingAddress: IAddress;
  paymentInfo: IPaymentInfo;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  name: {
    type: String,
    required: true,
  },
});

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
  },
});

const paymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['credit_card', 'paypal', 'stripe'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
  },
  paidAt: {
    type: Date,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [orderItemSchema],
  shippingAddress: {
    type: addressSchema,
    required: true,
  },
  billingAddress: {
    type: addressSchema,
    required: true,
  },
  paymentInfo: {
    type: paymentInfoSchema,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0,
  },
  tax: {
    type: Number,
    required: true,
    min: 0,
  },
  shipping: {
    type: Number,
    required: true,
    min: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  trackingNumber: {
    type: String,
  },
  estimatedDelivery: {
    type: Date,
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

// Indexes
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ 'paymentInfo.transactionId': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

// Method to calculate order totals
orderSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum: number, item: IOrderItem) => sum + (item.price * item.quantity), 0);
  this.tax = this.subtotal * 0.1; // 10% tax
  this.shipping = this.subtotal >= 100 ? 0 : 10; // Free shipping over $100
  this.total = this.subtotal + this.tax + this.shipping;
  return this;
};

// Method to update order status
orderSchema.methods.updateStatus = async function(status: IOrder['status'], notes?: string) {
  this.status = status;
  if (notes) this.notes = notes;
  
  if (status === 'shipped') {
    this.estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
  }
  
  return this.save();
};

// Method to process payment
orderSchema.methods.processPayment = async function(paymentMethod: IPaymentInfo['method'], transactionId: string) {
  this.paymentInfo.method = paymentMethod;
  this.paymentInfo.transactionId = transactionId;
  this.paymentInfo.status = 'completed';
  this.paymentInfo.paidAt = new Date();
  return this.save();
};

export const Order = mongoose.model<IOrder>('Order', orderSchema); 