import mongoose from 'mongoose';
import { IUser } from './User';
import { IProduct } from './Product';

export interface ICartItem {
  product: IProduct['_id'];
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface ICart extends mongoose.Document {
  user: IUser['_id'];
  sessionId?: string;
  items: ICartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'active' | 'converted' | 'abandoned';
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
  addItem(productId: string, quantity?: number): Promise<ICart>;
  removeItem(productId: string): Promise<ICart>;
  updateQuantity(productId: string, quantity: number): Promise<ICart>;
}

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sessionId: {
    type: String,
    sparse: true,
  },
  items: [cartItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0,
  },
  tax: {
    type: Number,
    required: true,
    default: 0,
  },
  shipping: {
    type: Number,
    required: true,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'converted', 'abandoned'],
    default: 'active',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
cartSchema.index({ user: 1, status: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ lastUpdated: 1 });

// Calculate totals before saving
cartSchema.pre('save', async function(next) {
  try {
    const populatedCart = await this.populate<{ items: Array<{ product: IProduct; quantity: number; price: number }> }>('items.product');
    
    // Calculate subtotal
    this.subtotal = populatedCart.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Calculate tax (assuming 10% tax rate)
    this.tax = this.subtotal * 0.1;

    // Calculate shipping (free shipping over $100, otherwise $10)
    this.shipping = this.subtotal >= 100 ? 0 : 10;

    // Calculate total
    this.total = this.subtotal + this.tax + this.shipping;

    // Update lastUpdated
    this.lastUpdated = new Date();

    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to add item to cart
cartSchema.methods.addItem = async function(productId: string, quantity: number = 1) {
  const product = await mongoose.model('Product').findById(productId);
  if (!product) throw new Error('Product not found');
  if (!product.isInStock(quantity)) throw new Error('Insufficient stock');

  const existingItem = this.items.find((item: ICartItem) => item.product.toString() === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    this.items.push({
      product: productId,
      quantity,
      price: product.price,
      addedAt: new Date(),
    });
  }

  return this.save();
};

// Method to remove item from cart
cartSchema.methods.removeItem = function(productId: string) {
  this.items = this.items.filter((item: ICartItem) => item.product.toString() !== productId);
  return this.save();
};

// Method to update item quantity
cartSchema.methods.updateQuantity = async function(productId: string, quantity: number) {
  const product = await mongoose.model('Product').findById(productId);
  if (!product) throw new Error('Product not found');
  if (!product.isInStock(quantity)) throw new Error('Insufficient stock');

  const item = this.items.find((item: ICartItem) => item.product.toString() === productId);
  if (item) {
    item.quantity = quantity;
  }

  return this.save();
};

export const Cart = mongoose.model<ICart>('Cart', cartSchema); 