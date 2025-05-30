export interface ProductImage {
  url: string;
  alt: string;
  isMain: boolean;
}

export interface ProductSpecification {
  [key: string]: string;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductDiscount {
  percentage: number;
  validUntil: Date;
  discountedPrice: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
  category: string;
  subCategory: string;
  stock: number;
  sku: string;
  brand: string;
  specifications: ProductSpecification;
  ratings: ProductRating;
  isActive: boolean;
  discount?: ProductDiscount;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'popularity' | 'date';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
} 