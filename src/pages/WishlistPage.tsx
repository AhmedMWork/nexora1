// ============================================================
// NEXORA — Wishlist Page
// ============================================================

import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProductCard from '@/components/ui/ProductCard';
import EmptyState from '@/components/ui/EmptyState';
import SectionReveal from '@/components/ui/SectionReveal';
import { useWishlistStore } from '@/stores/wishlistStore';
import { loadProducts } from '@/services/productService';
import type { Product } from '@/types';

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    loadProducts()
      .then((loadedProducts) => { if (mounted) setProducts(loadedProducts); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  const wishlistProducts = products.filter((p) => items.includes(p.id) || items.includes(p.slug));

  return (
    <>
      <Helmet><title>Wishlist | NEXORA</title></Helmet>
      <div className="pt-24 pb-20 bg-[#050505] min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <p className="nexora-caption text-[#c8a96a] mb-3">Saved Items</p>
            <h1 className="nexora-heading-md mb-10">YOUR WISHLIST</h1>
          </SectionReveal>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] bg-[#0b0b0d] border border-[#17171a] skeleton-pulse" />
              ))}
            </div>
          ) : wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {wishlistProducts.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <EmptyState type="wishlist" />
          )}
        </div>
      </div>
    </>
  );
}
