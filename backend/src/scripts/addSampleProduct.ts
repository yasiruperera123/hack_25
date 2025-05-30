import mongoose from 'mongoose';
import { Product } from '../models/Product';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const sampleProduct = {
  name: "Smartphone X Pro",
  description: "Latest flagship smartphone with advanced features and high-performance camera system.",
  price: 999.99,
  images: [
    {
      url: "https://example.com/images/smartphone-x-pro-1.jpg",
      alt: "Smartphone X Pro Front View",
      isMain: true
    },
    {
      url: "https://example.com/images/smartphone-x-pro-2.jpg",
      alt: "Smartphone X Pro Back View",
      isMain: false
    }
  ],
  category: "Electronics",
  subCategory: "Smartphones",
  stock: 50,
  sku: "SP-X-PRO-001",
  brand: "TechBrand",
  specifications: {
    "Screen Size": "6.5 inches",
    "RAM": "8GB",
    "Storage": "256GB",
    "Battery": "4500mAh",
    "Camera": "48MP + 12MP + 8MP"
  },
  ratings: {
    average: 4.5,
    count: 120
  },
  isActive: true,
  discount: {
    percentage: 10,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
};

async function addSampleProduct() {
  try {
    // Connect to MongoDB
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcart';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if product with same SKU exists
    const existingProduct = await Product.findOne({ sku: sampleProduct.sku });
    if (existingProduct) {
      console.log('Product with this SKU already exists');
      return;
    }

    // Create new product
    const product = new Product(sampleProduct);
    await product.save();
    console.log('Sample product added successfully:', product);

  } catch (error) {
    console.error('Error adding sample product:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
addSampleProduct(); 