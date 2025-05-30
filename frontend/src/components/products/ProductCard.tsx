import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const mainImage = product.images.find((img) => img.isMain) || product.images[0];

  return (
    <div className="group relative">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={mainImage?.url}
          alt={mainImage?.alt || product.name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <Link to={`/products/${product.id}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">
            ${product.discount ? product.discount.discountedPrice : product.price}
          </p>
          {product.discount && (
            <p className="text-sm text-gray-500 line-through">${product.price}</p>
          )}
        </div>
      </div>
      {product.stock <= 0 && (
        <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Out of Stock
        </div>
      )}
    </div>
  );
} 