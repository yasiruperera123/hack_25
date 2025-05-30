import api from '../utils/api';
import type { Product, ProductFilters, ProductResponse } from '../types/product';

export const productService = {
  async getProducts(filters: ProductFilters = {}): Promise<ProductResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  async getProduct(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  async getCategories(): Promise<string[]> {
    const response = await api.get('/products/categories');
    return response.data;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },
}; 