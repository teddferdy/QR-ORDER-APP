import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products, reviews } from '../data/mockData';
import { useCartStore } from '../store/useCartStore';
import { Star, ChevronLeft } from 'lucide-react';
import CustomizationPanel from '../components/CustomizationPanel';
import Skeleton from '../components/Skeleton';
import type { Size, Spiciness } from '../types';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);
  const addItem = useCartStore((state) => state.addItem);

  const [selectedSize, setSelectedSize] = useState<Size | undefined>();
  const [selectedSpiciness, setSelectedSpiciness] = useState<Spiciness | undefined>();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (!product) return <div className="text-center py-20">Produk tidak ditemukan</div>;

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnId)
        ? prev.filter((a) => a !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleAddToCart = () => {
    const customization = {
      size: selectedSize,
      spiciness: selectedSpiciness,
      addOns: product.addOns?.filter((a) => selectedAddOns.includes(a.id)),
      notes: notes || undefined,
    };
    addItem(product, customization);
    navigate('/cart');
  };

  const addOnTotal = selectedAddOns.reduce((sum, id) => {
    const addOn = product.addOns?.find((a) => a.id === id);
    return sum + (addOn?.price || 0);
  }, 0);

  const finalPrice = product.price + addOnTotal;
  const productReviews = reviews.filter((r) => r.productId === product.id);

  if (loading) {
    return (
      <div className="pb-20 space-y-6">
        <Skeleton width="3rem" height="3rem" borderRadius="50%" />
        <Skeleton width="100%" height="16rem" borderRadius="1.5rem" />
        <div className="space-y-4 px-4">
          <Skeleton width="70%" height="2rem" borderRadius="0.5rem" />
          <Skeleton width="100%" height="0.8rem" borderRadius="0.5rem" />
          <Skeleton width="60%" height="0.8rem" borderRadius="0.5rem" />
          <div className="flex gap-4 mt-4">
            <Skeleton width="5rem" height="2.5rem" borderRadius="9999px" />
            <Skeleton width="5rem" height="2.5rem" borderRadius="9999px" />
            <Skeleton width="5rem" height="2.5rem" borderRadius="9999px" />
          </div>
          <Skeleton width="100%" height="10rem" borderRadius="1.5rem" />
          <Skeleton width="100%" height="8rem" borderRadius="1.5rem" />
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 p-2 bg-white rounded-full shadow"
      >
        <ChevronLeft />
      </button>
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded-3xl mb-6"
      />

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-1 text-accent text-sm font-bold">
            <Star size={16} fill="currentColor" />
            {product.rating}
          </div>
        </div>

        <p className="text-gray-600">{product.description}</p>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>⏱ Estimasi {product.estimatedTime} menit</span>
          <span>
            {product.stock > 0 ? `✅ Stok: ${product.stock}` : '❌ Habis'}
          </span>
        </div>

        {product.ingredients.length > 0 && (
          <div>
            <h4 className="font-bold text-sm mb-2">Bahan-bahan</h4>
            <div className="flex gap-2 flex-wrap">
              {product.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-secondary px-3 py-1 rounded-full text-xs font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}

        <CustomizationPanel
          product={product}
          selectedSize={selectedSize}
          selectedSpiciness={selectedSpiciness}
          selectedAddOns={selectedAddOns}
          notes={notes}
          onSizeChange={setSelectedSize}
          onSpicinessChange={setSelectedSpiciness}
          onAddOnToggle={handleAddOnToggle}
          onNotesChange={setNotes}
        />

        {/* Reviews Section */}
        <div className="bg-white rounded-3xl p-6 space-y-4">
          <h3 className="font-bold text-lg">Ulasan Pembeli</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-accent">
              <Star size={16} fill="currentColor" />
              <span className="font-bold">{product.rating}</span>
            </div>
            <span className="text-gray-400 text-sm">
              ({product.reviewsCount} ulasan)
            </span>
          </div>
          <div className="space-y-4">
            {productReviews.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">
                    {review.userName}
                  </span>
                  <div className="flex items-center gap-1 text-accent text-xs">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        size={12}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Harga</span>
            <span className="font-bold text-xl text-primary">
              Rp{finalPrice.toLocaleString()}
            </span>
          </div>
          {addOnTotal > 0 && (
            <div className="text-xs text-gray-400">
              (+ Rp{addOnTotal.toLocaleString()} topping)
            </div>
          )}
          <button
            onClick={handleAddToCart}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold tap-scale"
          >
            Tambah ke Keranjang
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;