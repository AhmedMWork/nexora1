// ============================================================
// NEXORA V3.3 — Limited Releases Home Section
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Timer, ArrowRight, Sparkles } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { loadProducts } from '@/services/productService';
import type { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function LimitedDropsSection() {
  const [drops, setDrops] = useState<Product[]>([]);

  useEffect(() => {
    loadProducts({ isLimitedDrop: true }).then((items) => setDrops(items.filter((product) => product.isLimitedDrop).slice(0, 3)));
  }, []);

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--v33-bg-soft),var(--v33-bg))] dark:bg-[linear-gradient(135deg,#211915,#120F0D)]" />
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,var(--v33-text)_1px,transparent_0)] [background-size:38px_38px]" />

      <div className="relative z-10 v3-shell">
        <div className="grid lg:grid-cols-[0.8fr_1fr] gap-10 lg:gap-14 items-center">
          <SectionReveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="v33-limited-pill"><Timer className="w-3.5 h-3.5" /> Limited</span>
            </div>
            <h2 className="v3-title max-w-xl text-[clamp(2.3rem,5vw,4.9rem)]">Not part of the permanent shelf.</h2>
            <p className="v3-lead mt-6">Limited releases are released in smaller quantities and removed once the window closes. Each piece is designed to feel rare without being loud.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/limited" className="v3-btn-primary">Explore Limited <ArrowRight className="w-4 h-4" /></Link>
              <Link to="/shop" className="v3-btn-secondary">Shop essentials</Link>
            </div>
          </SectionReveal>

          <div className="space-y-4">
            {drops.length ? drops.map((product, i) => (
              <SectionReveal key={product.slug} delay={0.1 + i * 0.08}>
                <Link to={`/product/${product.slug}`} className="group v33-limited-row">
                  <div className="h-24 w-24 sm:h-28 sm:w-28 flex-shrink-0 overflow-hidden rounded-[18px] bg-[var(--v33-bg-soft)]">
                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[var(--v33-muted)]"><Sparkles className="h-3 w-3 text-[var(--v33-accent-strong)]" /> Limited · {product.category}</p>
                    <h3 className="truncate text-sm sm:text-base font-semibold text-[var(--v33-text)] group-hover:text-[var(--v33-accent-strong)] transition-colors">{product.name}</h3>
                    <p className="mt-1 text-xs font-bold text-[var(--v33-accent-strong)]">{formatPrice(product.price)}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[var(--v33-muted)] group-hover:text-[var(--v33-accent-strong)] transition-colors" />
                </Link>
              </SectionReveal>
            )) : (
              <SectionReveal>
                <div className="v33-empty-panel text-left rtl:text-right">
                  <p>No limited drop is live right now.</p>
                  <span className="mt-2 block text-xs text-[var(--v33-muted)]">The next release is being prepared.</span>
                </div>
              </SectionReveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
