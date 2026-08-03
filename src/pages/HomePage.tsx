import React, { useState, useEffect } from 'react';
import { products, menuCategories, filterOptions } from '../data/mockData';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import MenuCard from '../components/MenuCard';
import Skeleton from '../components/Skeleton';
import { useSettingsStore } from '../store/useSettingsStore';
import type { Category } from '../types';

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const { settings } = useSettingsStore();

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory;
    const matchesBestSeller =
      !activeFilters.includes('best-seller') || product.isBestSeller;
    const matchesPromo =
      !activeFilters.includes('promo') || product.isPromo;
    const matchesVegetarian =
      !activeFilters.includes('vegetarian') || product.isVegetarian;
    const matchesStore =
      !settings.storeId || product.storeId === settings.storeId;

    return (
      matchesSearch && matchesCategory && matchesBestSeller && matchesPromo && matchesVegetarian && matchesStore
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <header>
          <Skeleton width="60%" height="2rem" borderRadius="0.5rem" />
          <Skeleton width="40%" height="1rem" className="mt-2" />
        </header>
        <Skeleton width="100%" height="2.5rem" borderRadius="1rem" />
        <Skeleton width="100%" height="2.5rem" borderRadius="1rem" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-3xl overflow-hidden space-y-4 p-4">
              <Skeleton width="100%" height="10rem" borderRadius="1rem" />
              <Skeleton width="80%" height="1.2rem" borderRadius="0.5rem" />
              <Skeleton width="60%" height="0.8rem" borderRadius="0.5rem" />
              <Skeleton width="40%" height="1.5rem" borderRadius="0.5rem" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display text-gray-900">
          Halo, mau makan apa hari ini?
        </h1>
        <p className="text-gray-500 mt-1">
          Pilih menu favoritmu dan mulai pesan!
        </p>
      </header>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
      />

      <FilterBar
        filters={filterOptions}
        activeFilters={activeFilters}
        onToggle={toggleFilter}
      />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm ${
            selectedCategory === 'All'
              ? 'bg-primary text-white shadow-lg'
              : 'bg-white text-gray-600'
          }`}
        >
          Semua
        </button>
        {menuCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as Category)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all text-sm ${
              selectedCategory === cat.id
                ? 'bg-primary text-white shadow-lg'
                : 'bg-white text-gray-600'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Tidak ada menu yang cocok dengan pencarianmu.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map((product) => (
            <MenuCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;