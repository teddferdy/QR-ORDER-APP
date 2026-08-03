import React from 'react';
import { Star, Plus } from 'lucide-react';
import type { Product } from '../types';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

interface MenuCardProps {
  product: Product;
}

const MenuCard: React.FC<MenuCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="bg-white rounded-3xl shadow-sm overflow-hidden tap-scale cursor-pointer"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover"
        />
        {product.isPromo && (
          <span className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full">
            Promo
          </span>
        )}
        {product.stock <= 5 && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Terbatas
          </span>
        )}
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base line-clamp-1">{product.name}</h3>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-1 text-accent text-xs font-bold">
          <Star size={12} fill="currentColor" />
          {product.rating} ({product.reviewsCount})
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold text-primary text-lg">
            Rp{product.price.toLocaleString()}
          </span>
          <button
            onClick={handleAddToCart}
            className="bg-secondary text-primary p-2 rounded-full hover:bg-primary hover:text-white transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;