import React from 'react';
import { Star, Plus } from 'lucide-react';
import type { Product } from '../types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

interface MenuCardProps {
  product: Product;
}

const MenuCard: React.FC<MenuCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const addItem = useCartStore((state) => state.addItem);

  const href = (path: string) => {
    const sep = path.includes('?') ? '&' : '?';
    return `${path}${sep}table=${searchParams.get('table') || ''}&store=${searchParams.get('store') || ''}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div
      onClick={() => navigate(href(`/product/${product.id}`))}
      className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm dark:shadow-gray-900/30 overflow-hidden tap-scale cursor-pointer border border-gray-50 dark:border-gray-700/50 transition-colors"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        {product.isPromo && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Promo
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Sisa {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
            Habis
          </span>
        )}
      </div>
      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base line-clamp-1 text-gray-900 dark:text-gray-100">{product.name}</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">{product.description}</p>
        <div className="flex items-center gap-1.5 text-accent text-xs font-bold">
          <Star size={12} fill="currentColor" />
          <span>{product.rating}</span>
          <span className="text-gray-400 dark:text-gray-500 font-normal">({product.reviewsCount})</span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-bold text-primary text-lg">
            Rp{product.price.toLocaleString()}
          </span>
          {product.stock > 0 ? (
            <button
              onClick={handleAddToCart}
              className="bg-primary/10 text-primary p-2.5 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm"
            >
              <Plus size={18} strokeWidth={2.5} />
            </button>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500 font-medium px-3 py-2">
              Stok habis
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
