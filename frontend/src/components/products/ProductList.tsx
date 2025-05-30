import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  return (
    <div className="space-y-4">
      {products.map((product) => {
        const mainImage = product.images.find((img) => img.isMain) || product.images[0];
        return (
          <div
            key={product.id}
            className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div className="flex-shrink-0 w-24 h-24">
              <img
                src={mainImage?.url}
                alt={mainImage?.alt || product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${product.id}`}
                className="text-lg font-medium text-gray-900 hover:text-blue-600"
              >
                {product.name}
              </Link>
              <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-lg font-medium text-gray-900">
                ${product.discount ? product.discount.discountedPrice : product.price}
              </p>
              {product.discount && (
                <p className="text-sm text-gray-500 line-through">${product.price}</p>
              )}
              {product.stock <= 0 ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  In Stock
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
} 