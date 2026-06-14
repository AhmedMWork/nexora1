// ============================================================
// NEXORA — Featured Collection Section
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { loadProducts } from '@/services/productService';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function FeaturedCollectionSection() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts({ isFeatured: true }).then((products) => setFeatured(products.slice(0, 3)));
  }, []);

  const mainProduct = featured[0];
  const sideProducts = featured.slice(1);

  if (!mainProduct) return null;

  return (
    <section className="py-20 lg:py-32 bg-[#050505]">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <SectionReveal>
          <p className="nexora-caption text-[#c8a96a] mb-3">Curated Selection</p>
          <h2 className="nexora-heading-md mb-12">FEATURED</h2>
        </SectionReveal>

        <div className="grid lg:grid-cols-7 gap-4">
          {/* Main Feature */}
          <SectionReveal className="lg:col-span-4" delay={0.1}>
            <Link
              to={`/product/${mainProduct.slug}`}
              className="group relative block aspect-[4/5] lg:aspect-auto lg:h-[700px] overflow-hidden bg-[#0b0b0d] border border-[#17171a] hover:border-[#2a2a2d] transition-all"
            >
              <img
                src={mainProduct.images[0]}
                alt={mainProduct.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96a] mb-2">
                  {mainProduct.category} — {mainProduct.collection}
                </p>
                <h3 className="text-2xl lg:text-3xl font-bold text-[#f4f0e8] mb-2 group-hover:text-[#c8a96a] transition-colors">
                  {mainProduct.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold">{formatPrice(mainProduct.price)}</span>
                  {mainProduct.compareAtPrice && (
                    <span className="text-sm text-[#8a8175] line-through">
                      {formatPrice(mainProduct.compareAtPrice)}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-[#c8a96a] text-[#050505] opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </Link>
          </SectionReveal>

          {/* Side Features */}
          <div className="lg:col-span-3 grid grid-rows-2 gap-4">
            {sideProducts.map((product, i) => (
              <SectionReveal key={product.slug} delay={0.2 + i * 0.1}>
                <Link
                  to={`/product/${product.slug}`}
                  className="group relative block h-full min-h-[250px] overflow-hidden bg-[#0b0b0d] border border-[#17171a] hover:border-[#2a2a2d] transition-all"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96a] mb-1">
                      {product.collection}
                    </p>
                    <h3 className="text-lg font-bold text-[#f4f0e8] group-hover:text-[#c8a96a] transition-colors">
                      {product.name}
                    </h3>
                    <span className="text-sm font-semibold mt-1 block">{formatPrice(product.price)}</span>
                  </div>
                </Link>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
