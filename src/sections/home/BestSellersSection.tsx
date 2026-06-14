// ============================================================
// NEXORA — Best Sellers Section
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import SectionReveal from '@/components/ui/SectionReveal';
import { loadProducts } from '@/services/productService';
import type { Product } from '@/types';

export default function BestSellersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts({ isBestSeller: true }).then(setBestSellers);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -340 : 340;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  return (
    <section className="py-20 lg:py-32 bg-[#050505]">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <SectionReveal className="flex items-end justify-between mb-12">
          <div>
            <p className="nexora-caption text-[#c8a96a] mb-3">Most Loved</p>
            <h2 className="nexora-heading-md">BEST SELLERS</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="w-10 h-10 flex items-center justify-center border border-[#202024] text-[#b8b0a3] hover:border-[#c8a96a] hover:text-[#c8a96a] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-10 h-10 flex items-center justify-center border border-[#202024] text-[#b8b0a3] hover:border-[#c8a96a] hover:text-[#c8a96a] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </SectionReveal>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {bestSellers.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px]"
            >
              <ProductCard
                product={product}
                index={0}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
