import { Response } from 'express';
import { Product, IProduct } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Get all products with filtering, sorting, and pagination
export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      category,
      minPrice,
      maxPrice,
      search,
    } = req.query;

    // Build query
    const query: any = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Search query
    if (search) {
      query.$text = { $search: search as string };
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort as string)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.json({
      products,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalProducts: total,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

// Get single product by ID
export const getProductById = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
};

// Get all categories
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const categories = await Product.distinct('category');
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Search products
export const searchProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const products = await Product.find(
      { $text: { $search: q as string } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(10);

    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

// Create new product (admin only)
export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      price,
      images,
      category,
      subCategory,
      stock,
      sku,
      brand,
      specifications,
    } = req.body;

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({ error: 'SKU already exists' });
    }

    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      subCategory,
      stock,
      sku,
      brand,
      specifications,
    });

    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
};

// Update product (admin only)
export const updateProduct = async (req: AuthRequest, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'name',
    'description',
    'price',
    'images',
    'category',
    'subCategory',
    'stock',
    'brand',
    'specifications',
    'isActive',
  ] as const;

  const isValidOperation = updates.every(update => allowedUpdates.includes(update as typeof allowedUpdates[number]));
  if (!isValidOperation) {
    return res.status(400).json({ error: 'Invalid updates' });
  }

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    updates.forEach(update => {
      const key = update as keyof IProduct;
      (product as any)[key] = req.body[key];
    });

    await product.save();
    res.json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update product' });
  }
};

// Delete product (admin only)
export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Soft delete by setting isActive to false
    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

// Update product stock (admin only)
export const updateStock = async (req: AuthRequest, res: Response) => {
  try {
    const { stock } = req.body;
    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({ error: 'Invalid stock value' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.stock = stock;
    await product.save();

    res.json({ product });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update stock' });
  }
}; 