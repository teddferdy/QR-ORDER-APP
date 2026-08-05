import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useStoreConfig } from "../hooks/useStoreConfig";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import MenuCard from "../components/MenuCard";
import Skeleton from "../components/Skeleton";
import type { Category } from "../types";

const filterOptions: { id: string; label: string; icon: string }[] = [];

const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(
    "All",
  );
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchParams] = useSearchParams();
  const table = searchParams.get("table");
  const store = searchParams.get("store");

  const { products, categories, loading, error } = useProducts(store);
  const { config } = useStoreConfig(store);

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesBestSeller =
      !activeFilters.includes("best-seller") || product.isBestSeller;
    const matchesPromo = !activeFilters.includes("promo") || product.isPromo;
    const matchesVegetarian =
      !activeFilters.includes("vegetarian") || product.isVegetarian;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBestSeller &&
      matchesPromo &&
      matchesVegetarian
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <header>
          <Skeleton width="60%" height="2rem" borderRadius="0.75rem" />
          <Skeleton
            width="40%"
            height="1rem"
            className="mt-3"
            borderRadius="0.5rem"
          />
        </header>
        <Skeleton width="100%" height="3rem" borderRadius="1rem" />
        <Skeleton width="100%" height="3rem" borderRadius="1rem" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden space-y-4 p-4 border border-gray-50 dark:border-gray-700/50"
            >
              <Skeleton width="100%" height="11rem" borderRadius="1rem" />
              <Skeleton width="80%" height="1.2rem" borderRadius="0.5rem" />
              <Skeleton width="60%" height="0.8rem" borderRadius="0.5rem" />
              <Skeleton width="40%" height="1.5rem" borderRadius="0.5rem" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-gray-500 dark:text-gray-400 font-medium">{error}</p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Coba muat ulang halaman.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-display text-gray-900 dark:text-gray-100">
          Halo, mau makan apa hari ini?
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Pilih menu favoritmu dan mulai pesan!
        </p>
        <div className="flex items-center gap-2">
          {table && (
            <span className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold">
              Meja {table}
            </span>
          )}
          {config.storeName && (
            <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full text-xs font-bold">
              {config.storeName}
            </span>
          )}
        </div>
      </header>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <FilterBar
        filters={filterOptions}
        activeFilters={activeFilters}
        onToggle={toggleFilter}
      />

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-4 py-2.5 rounded-full font-medium whitespace-nowrap transition-all text-sm shadow-sm ${
            selectedCategory === "All"
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as Category)}
            className={`px-4 py-2.5 rounded-full font-medium whitespace-nowrap transition-all text-sm shadow-sm ${
              selectedCategory === cat.id
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Tidak ada menu yang cocok dengan pencarianmu.
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Coba kata kunci atau filter lain.
          </p>
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
