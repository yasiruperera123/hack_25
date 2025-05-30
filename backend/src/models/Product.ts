import mongoose from 'mongoose';

export interface IProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  images: IProductImage[];
  category: string;
  subCategory?: string;
  stock: number;
  sku: string;
  brand?: string;
  specifications: Record<string, string>;
  ratings: {
    average: number;
    count: number;
  };
  isActive: boolean;
  discount?: {
    percentage: number;
    validUntil: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  isInStock(quantity?: number): boolean;
  discountedPrice: number;
}

const productImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  isMain: {
    type: Boolean,
    default: false,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  images: [productImageSchema],
  category: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  subCategory: {
    type: String,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  brand: {
    type: String,
    trim: true,
  },
  specifications: {
    type: Map,
    of: String,
    default: {},
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  discount: {
    percentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    validUntil: {
      type: Date,
    },
  },
}, {
  timestamps: true,
});

// Indexes
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (this.discount?.percentage && this.discount?.validUntil && this.discount.validUntil > new Date()) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

// Method to check if product is in stock
productSchema.methods.isInStock = function(quantity: number = 1): boolean {
  return this.stock >= quantity;
};

export const Product = mongoose.model<IProduct>('Product', productSchema); 