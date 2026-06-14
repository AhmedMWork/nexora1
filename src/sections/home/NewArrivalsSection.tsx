// ============================================================
// NEXORA — New Arrivals Section
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import SectionReveal from '@/components/ui/SectionReveal';
import { loadProducts } from '@/services/productService';
import type { Product } from '@/types';

export default function NewArrivalsSection() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts({ isNewArrival: true }).then((products) => setNewArrivals(products.slice(0, 4)));
  }, []);

  return (
    <section className="py-20 lg:py-32 bg-[#050505]">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <SectionReveal className="flex items-end justify-between mb-12">
          <div>
            <p className="nexora-caption text-[#c8a96a] mb-3">Just Landed</p>
            <h2 className="nexora-heading-md">NEW ARRIVALS</h2>
          </div>
          <Link
            to="/shop?sort=newest"
            className="hidden sm:flex items-center gap-2 text-xs tracking-wider uppercase text-[#b8b0a3] hover:text-[#c8a96a] transition-colors"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </SectionReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newArrivals.map((product, i) => (
            <ProductCard
              key={product.slug}
              product={product}
              index={i}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-8 text-center">
          <Link
            to="/shop?sort=newest"
            className="nexora-button inline-flex items-center gap-2"
          >
            View All New Arrivals
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
