import type { ProductFilters } from '../../types/product';

interface FilterSidebarProps {
  categories: string[];
  selectedCategory: string;
  minPrice?: number;
  maxPrice?: number;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

export function FilterSidebar({
  categories,
  selectedCategory,
  minPrice,
  maxPrice,
  onFilterChange,
}: FilterSidebarProps) {
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    onFilterChange({
      minPrice: type === 'min' ? value : minPrice,
      maxPrice: type === 'max' ? value : maxPrice,
    });
  };

  const handleSortChange = (value: ProductFilters['sortBy']) => {
    onFilterChange({ sortBy: value });
  };

  const handleSortOrderChange = (value: ProductFilters['sortOrder']) => {
    onFilterChange({ sortOrder: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <div className="mt-4 space-y-2">
          <button
            className={`block w-full text-left px-4 py-2 rounded-md ${
              selectedCategory === ''
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onFilterChange({ category: '' })}
          >
            All Categories
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                selectedCategory === category
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => onFilterChange({ category })}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Price Range</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="min-price" className="block text-sm font-medium text-gray-700">
              Min Price
            </label>
            <input
              type="number"
              id="min-price"
              value={minPrice || ''}
              onChange={(e) => handlePriceChange('min', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              min="0"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="block text-sm font-medium text-gray-700">
              Max Price
            </label>
            <input
              type="number"
              id="max-price"
              value={maxPrice || ''}
              onChange={(e) => handlePriceChange('max', Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              min="0"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900">Sort By</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="sort-by" className="block text-sm font-medium text-gray-700">
              Sort Field
            </label>
            <select
              id="sort-by"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              onChange={(e) => handleSortChange(e.target.value as ProductFilters['sortBy'])}
            >
              <option value="popularity">Popularity</option>
              <option value="price">Price</option>
              <option value="name">Name</option>
              <option value="date">Date</option>
            </select>
          </div>
          <div>
            <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <select
              id="sort-order"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              onChange={(e) => handleSortOrderChange(e.target.value as ProductFilters['sortOrder'])}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <button
          type="button"
          className="w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={() => onFilterChange({ category: '', minPrice: undefined, maxPrice: undefined })}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
} 