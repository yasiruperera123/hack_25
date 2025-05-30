import mongoose from 'mongoose';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Cart } from '../models/Cart';
import { Order } from '../models/Order';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@smartcart.com',
      password: adminPassword,
      role: 'admin',
      addresses: [{
        street: '123 Admin St',
        city: 'Admin City',
        state: 'Admin State',
        country: 'Admin Country',
        zipCode: '12345',
        isDefault: true,
      }],
      isEmailVerified: true,
    });

    // Create regular user
    const userPassword = await bcrypt.hash('user123', 10);
    const user = await User.create({
      name: 'Regular User',
      email: 'user@smartcart.com',
      password: userPassword,
      role: 'customer',
      addresses: [{
        street: '456 User St',
        city: 'User City',
        state: 'User State',
        country: 'User Country',
        zipCode: '67890',
        isDefault: true,
      }],
      isEmailVerified: true,
    });

    // Create sample products
    const products = await Product.create([
      {
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced features',
        price: 999.99,
        images: [{
          url: 'https://example.com/smartphone-x.jpg',
          alt: 'Smartphone X',
          isMain: true,
        }],
        category: 'Electronics',
        subCategory: 'Smartphones',
        stock: 50,
        sku: 'SPX001',
        brand: 'TechBrand',
        specifications: {
          'Screen Size': '6.5 inches',
          'Battery': '4500mAh',
          'Storage': '128GB',
        },
        ratings: {
          average: 4.5,
          count: 100,
        },
        isActive: true,
      },
      {
        name: 'Laptop Pro',
        description: 'High-performance laptop for professionals',
        price: 1499.99,
        images: [{
          url: 'https://example.com/laptop-pro.jpg',
          alt: 'Laptop Pro',
          isMain: true,
        }],
        category: 'Electronics',
        subCategory: 'Laptops',
        stock: 30,
        sku: 'LP001',
        brand: 'TechBrand',
        specifications: {
          'Processor': 'Intel i7',
          'RAM': '16GB',
          'Storage': '512GB SSD',
        },
        ratings: {
          average: 4.8,
          count: 75,
        },
        isActive: true,
      },
    ]);

    // Create sample cart for user
    const cart = await Cart.create({
      user: user._id,
      items: [{
        product: products[0]._id,
        quantity: 1,
        price: products[0].price,
        addedAt: new Date(),
      }],
      status: 'active',
    });

    // Create sample order
    const order = await Order.create({
      user: user._id,
      items: [{
        product: products[0]._id,
        quantity: 1,
        price: products[0].price,
        name: products[0].name,
      }],
      shippingAddress: user.addresses[0],
      billingAddress: user.addresses[0],
      paymentInfo: {
        method: 'credit_card',
        status: 'completed',
        transactionId: 'TRX123456',
        amount: 1099.99,
        currency: 'USD',
        paidAt: new Date(),
      },
      subtotal: 999.99,
      tax: 99.99,
      shipping: 0,
      total: 1099.99,
      status: 'delivered',
      trackingNumber: 'TRK789012',
      estimatedDelivery: new Date(),
    });

    console.log('Seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

// Connect to MongoDB and run seed
mongoose.connect('mongodb+srv://yasirulochanaperera:yasiru123@cluster0.b8skhv0.mongodb.net/smartcart?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('Connected to MongoDB');
    seedData();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 