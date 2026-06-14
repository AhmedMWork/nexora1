// ============================================================
// NEXORA V3.4 — Limited Releases Page
// Limited is not a permanent shelf: only live drops are shoppable here.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Hourglass, Sparkles, Timer } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import ProductCard from '@/components/ui/ProductCard';
import { loadProducts } from '@/services/productService';
import { getDrops } from '@/services/drop.service';
import type { Drop, Product } from '@/types';

function toMillis(value: unknown, fallback: number) {
  if (!value) return fallback;
  if (value instanceof Date) return value.getTime();
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().getTime();
  }
  const parsed = new Date(value as string | number).getTime();
  return Number.isFinite(parsed) ? parsed : fallback;
}

function isDropLive(drop: Drop) {
  if (drop.status !== 'live') return false;
  const now = Date.now();
  const start = toMillis(drop.launchDate, 0);
  const end = toMillis(drop.endDate, Infinity);
  return now >= start && now <= end;
}

export default function DropsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [liveDrops, setLiveDrops] = useState<Drop[]>([]);
  const [scheduledDrops, setScheduledDrops] = useState<Drop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    Promise.all([loadProducts({ isLimitedDrop: true }), getDrops(false)])
      .then(([items, drops]) => {
        if (!mounted) return;
        const live = drops.filter(isDropLive);
        const scheduled = drops.filter((d) => d.status === 'scheduled');
        const liveDropIds = new Set(live.map((d) => d.id));
        const liveProductIds = new Set(live.flatMap((d) => d.productIds || []));
        const filtered = items.filter((p) => {
          if (p.status && !['active', 'sold_out'].includes(p.status)) return false;
          if (!p.isLimitedDrop) return false;
          if (live.length === 0) return false;
          return (p.dropId && liveDropIds.has(p.dropId)) || liveProductIds.has(p.id) || liveProductIds.has(p.slug);
        });
        setLiveDrops(live);
        setScheduledDrops(scheduled);
        setProducts(filtered);
      })
      .catch(() => {
        if (mounted) {
          setLiveDrops([]);
          setScheduledDrops([]);
          setProducts([]);
        }
      })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  const currentDrop = liveDrops[0];
  const featured = products[0];
  const totalPieces = useMemo(() => products.reduce((sum, product) => sum + product.sizes.reduce((sizeSum, size) => sizeSum + Math.max(0, size.stock), 0), 0), [products]);

  return (
    <>
      <Helmet>
        <title>Limited Releases | NEXORA</title>
        <meta name="description" content="NEXORA limited releases are available only during selected windows. When a release ends, it leaves the main store." />
      </Helmet>

      <main className="pt-24 pb-20 v3-page min-h-screen overflow-hidden">
        <section className="v3-shell">
          <div className="grid lg:grid-cols-[1fr_0.85fr] gap-8 lg:gap-12 items-center min-h-[58vh]">
            <SectionReveal>
              <div className="flex flex-wrap items-center gap-3 mb-5">
                <span className="v33-limited-pill"><Sparkles className="h-3.5 w-3.5" /> Limited</span>
                <span className="v3-kicker">Selected windows only</span>
              </div>
              <h1 className="v3-title max-w-3xl">Limited releases, never permanent.</h1>
              <p className="v3-lead mt-6">NEXORA limited pieces are available only while a live release is open. Once the release ends, the pieces leave the regular store.</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/shop" className="v3-btn-primary">Shop Core Essentials <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/shop/unisex" className="v3-btn-secondary">Explore Unisex</Link>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.12}>
              <div className="v33-limited-hero-card">
                {featured && currentDrop ? (
                  <>
                    <img src={featured.images[0]} alt={featured.name} className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#171210]/86 via-[#171210]/24 to-transparent dark:from-[#0E0B0A]/92" />
                    <div className="relative z-10 mt-auto p-6 sm:p-8">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#FFFDF8]/80">Live limited release</p>
                      <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-[#FFFDF8]">{currentDrop.name}</h2>
                      <p className="mt-3 max-w-md text-sm leading-7 text-[#F4E8DA]/80">{currentDrop.description}</p>
                      <Link to={`/product/${featured.slug}`} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#D2B48C]">View piece <ArrowRight className="h-3.5 w-3.5" /></Link>
                    </div>
                  </>
                ) : (
                  <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                    <Hourglass className="h-10 w-10 text-[var(--v33-accent)]" />
                    <h2 className="mt-5 text-2xl font-semibold text-[var(--v33-text)]">No limited release is live right now.</h2>
                    <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--v33-muted)]">Limited pieces are released in selected windows only. Core essentials remain available in the shop.</p>
                    <Link to="/shop" className="v3-btn-secondary mt-6">Shop core essentials</Link>
                  </div>
                )}
              </div>
            </SectionReveal>
          </div>
        </section>

        <section className="v3-shell mt-14 lg:mt-20">
          <div className="grid sm:grid-cols-3 gap-3 mb-10">
            <div className="v33-stat-card"><Timer className="h-4 w-4" /><span>Limited status</span><strong>{currentDrop ? 'Live now' : 'Closed'}</strong></div>
            <div className="v33-stat-card"><Sparkles className="h-4 w-4" /><span>Live pieces</span><strong>{products.length}</strong></div>
            <div className="v33-stat-card"><Hourglass className="h-4 w-4" /><span>Available stock</span><strong>{totalPieces}</strong></div>
          </div>

          <div className="v3-section-head">
            <div>
              <p className="v3-kicker">Limited releases</p>
              <h2>{currentDrop ? 'Available now' : 'Between releases'}</h2>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] rounded-3xl bg-[var(--v33-card)] animate-pulse" />)}
            </div>
          ) : products.length ? (
            <motion.div layout className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.map((product, i) => <ProductCard key={product.slug} product={product} index={i} />)}
            </motion.div>
          ) : (
            <div className="v33-empty-panel">
              <p>No limited release is live right now.</p>
              {scheduledDrops.length > 0 && <p className="mt-2 text-xs">A new limited window is scheduled soon.</p>}
              <Link to="/shop" className="v3-btn-secondary mt-5">Shop core essentials</Link>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
