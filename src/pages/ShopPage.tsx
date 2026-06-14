// ============================================================
// NEXORA — Shop Page
// ============================================================

import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import SectionReveal from '@/components/ui/SectionReveal';
import type { Product } from '@/types';
import { loadProducts } from '@/services/productService';
import { PRODUCT_CATEGORIES, PRODUCT_SIZES, PRODUCT_COLORS, SORT_OPTIONS, PRICE_RANGES } from '@/lib/constants';

export default function ShopPage() {
  const { category } = useParams<{ category?: string }>();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCollection, setSelectedCollection] = useState(category || '');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    loadProducts(category ? { category } : undefined)
      .then((loadedProducts) => { if (mounted) setProducts(loadedProducts); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, [category]);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    setSelectedCollection(category || '');
  }, [category]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Collection filter
    if (selectedCollection) {
      result = result.filter((p) => p.category === selectedCollection);
    }

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => selectedSizes.includes(s.size) && s.stock > 0)
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => selectedColors.includes(c))
      );
    }

    // Price filter
    if (selectedPriceRange) {
      const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
      if (range) {
        result = result.filter(
          (p) => p.price >= range.min && p.price <= range.max
        );
      }
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'best-selling':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCollection, searchQuery, selectedSizes, selectedColors, selectedPriceRange, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const clearFilters = () => {
    setSelectedCollection('');
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedPriceRange('');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCollection || selectedSizes.length > 0 || selectedColors.length > 0 || selectedPriceRange || searchQuery;

  return (
    <>
      <Helmet>
        <title>Shop | NEXORA — Soft Luxury Essentials</title>
        <meta name="description" content="Browse NEXORA's collection of premium summer t-shirts for men, women, and unisex. Filter by size, color, and price." />
        <link rel="canonical" href={`/shop${category ? `/${category}` : ''}`} />
      </Helmet>

      <div className="pt-24 pb-20 v3-page min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          {/* Header */}
          <SectionReveal>
            <p className="nexora-caption text-[#c8a96a] mb-3">Ivory Atelier</p>
            <h1 className="nexora-heading-md mb-8">
              {selectedCollection
                ? `${selectedCollection === 'men' ? "MEN'S" : selectedCollection === 'women' ? "WOMEN'S" : 'UNISEX'} ESSENTIALS`
                : 'ALL PRODUCTS'}
            </h1>
          </SectionReveal>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {/* Search */}
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8175]" />
              <input
                type="text"
                placeholder="Search the collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b0b0d] border border-[#202024] pl-10 pr-4 py-2.5 text-sm text-[#f4f0e8] placeholder:text-[#6f675d] focus:outline-none focus:border-[#c8a96a] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a8175] hover:text-[#f4f0e8]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#0b0b0d] border border-[#202024] px-3 py-2.5 text-xs text-[#b8b0a3] focus:outline-none focus:border-[#c8a96a]"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 border text-xs tracking-wider uppercase transition-colors ${
                  showFilters
                    ? 'border-[#c8a96a] text-[#c8a96a]'
                    : 'border-[#202024] text-[#b8b0a3] hover:text-[#f4f0e8]'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="border border-[#17171a] bg-[#0b0b0d] p-5 mb-8"
            >
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Collection */}
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b8b0a3] mb-3">Collection</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() =>
                          setSelectedCollection(selectedCollection === cat.value ? '' : cat.value)
                        }
                        className={`px-3 py-1.5 text-xs border transition-colors ${
                          selectedCollection === cat.value
                            ? 'border-[#c8a96a] text-[#c8a96a] bg-[#c8a96a]/5'
                            : 'border-[#202024] text-[#8a8175] hover:border-[#6f675d]'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b8b0a3] mb-3">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`w-9 h-9 flex items-center justify-center text-xs border transition-colors ${
                          selectedSizes.includes(size)
                            ? 'border-[#c8a96a] text-[#c8a96a] bg-[#c8a96a]/5'
                            : 'border-[#202024] text-[#8a8175] hover:border-[#6f675d]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b8b0a3] mb-3">Color</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRODUCT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => toggleColor(color.value)}
                        title={color.label}
                        className={`w-7 h-7 border-2 transition-colors ${
                          selectedColors.includes(color.value)
                            ? 'border-[#c8a96a] scale-110'
                            : 'border-transparent hover:border-[#6f675d]'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b8b0a3] mb-3">Price</h4>
                  <div className="flex flex-wrap gap-2">
                    {PRICE_RANGES.map((range) => (
                      <button
                        key={range.label}
                        onClick={() =>
                          setSelectedPriceRange(selectedPriceRange === range.label ? '' : range.label)
                        }
                        className={`px-3 py-1.5 text-xs border transition-colors ${
                          selectedPriceRange === range.label
                            ? 'border-[#c8a96a] text-[#c8a96a] bg-[#c8a96a]/5'
                            : 'border-[#202024] text-[#8a8175] hover:border-[#6f675d]'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-[#17171a] flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="text-xs text-[#b8b0a3] hover:text-[#c8a96a] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Results count */}
          <p className="text-xs text-[#8a8175] mb-6">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </p>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#0b0b0d] border border-[#17171a] skeleton-pulse" />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product, i) => (
                <ProductCard key={product.slug} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-[#8a8175] mb-4">No products match your criteria</p>
              <button
                onClick={clearFilters}
                className="nexora-button text-xs"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
