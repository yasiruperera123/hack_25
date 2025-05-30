import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { productService } from '../services/productService';
import type { Product, ProductFilters } from '../types/product';
import { ProductCard } from '../components/products/ProductCard';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductList } from '../components/products/ProductList';
import { FilterSidebar } from '../components/products/FilterSidebar';
import { SearchBar } from '../components/products/SearchBar';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { log } from 'console';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>([]);

  // Get filter values from URL
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const sortBy = (searchParams.get('sortBy') as ProductFilters['sortBy']) || 'popularity';
  const sortOrder = (searchParams.get('sortOrder') as ProductFilters['sortOrder']) || 'desc';
  const page = Number(searchParams.get('page')) || 1;

  const debouncedSearch = useDebounce(search, 300);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: ProductFilters = {
        search: debouncedSearch,
        category,
        minPrice,
        maxPrice,
        sortBy,
        sortOrder,
        page,
        limit: 12,
      };
      const response = await productService.getProducts(filters);
      
      setProducts(response.products);
      setTotalPages(response.totalPages);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, minPrice, maxPrice, sortBy, sortOrder, page]);

  const fetchCategories = useCallback(async () => {
    try {
      const categories = await productService.getCategories();
      setCategories(categories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    const current = Object.fromEntries(searchParams.entries());
    const updatedParams = {
      ...current,
      ...Object.fromEntries(
        Object.entries(newFilters).map(([key, value]) => [
          key,
          value?.toString() || '',
        ])
      ),
      page: '1',
    };
    setSearchParams(updatedParams);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('page', newPage.toString());
      return newParams;
    });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Products</h1>
          <div className="flex items-center">
            <button
              type="button"
              className={`p-2 ${viewMode === 'grid' ? 'text-blue-600' : 'text-gray-400'}`}
              onClick={() => setViewMode('grid')}
            >
              <span className="sr-only">Grid view</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              type="button"
              className={`ml-4 p-2 ${viewMode === 'list' ? 'text-blue-600' : 'text-gray-400'}`}
              onClick={() => setViewMode('list')}
            >
              <span className="sr-only">List view</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="pt-24 pb-16">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            <FilterSidebar
              categories={categories}
              selectedCategory={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onFilterChange={handleFilterChange}
            />

            <div className="lg:col-span-3">
              <SearchBar
                value={search}
                onChange={(value) => handleFilterChange({ search: value })}
              />

              <div className="mt-6">
                {loading ? (
                  <LoadingSpinner />
                ) : viewMode === 'grid' ? (
                  <ProductGrid products={products} />
                ) : (
                  <ProductList products={products} />
                )}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                          pageNum === page
                            ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 