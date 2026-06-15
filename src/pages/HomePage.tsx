import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import type { Product, Review } from '@/types';
import { loadProducts } from '@/services/productService';
import { useI18n } from '@/i18n/I18nProvider';

const categoryTiles = [
  { title: 'Oversized Tees', ar: 'تيشيرتات واسعة', href: '/shop/unisex', image: '/assets/products/women-sand-tee.jpg' },
  { title: 'Core Essentials', ar: 'أساسيات يومية', href: '/shop', image: '/assets/products/men-cream-tee.jpg' },
  { title: 'Limited', ar: 'الإصدارات المحدودة', href: '/limited', image: '/assets/nexora-logo-bg.jpg' },
];

export default function HomePage() {
  const { lang, t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    let mounted = true;
    setIsLoadingProducts(true);
    loadProducts({ isFeatured: true })
      .then((items) => { if (mounted) setProducts(items.slice(0, 4)); })
      .catch(() => { if (mounted) setProducts([]); })
      .finally(() => { if (mounted) setIsLoadingProducts(false); });

    import('@/lib/supabase/db')
      .then(({ getReviews }) => getReviews({ isApproved: true, isFeatured: true }))
      .then((items) => { if (mounted) setReviews(items.slice(0, 3)); })
      .catch(() => { if (mounted) setReviews([]); });

    return () => { mounted = false; };
  }, []);

  const trustItems = useMemo(() => [
    { icon: Truck, title: t('home.trust.delivery.title'), body: t('home.trust.delivery.body') },
    { icon: Sparkles, title: t('home.trust.materials.title'), body: t('home.trust.materials.body') },
    { icon: RotateCcw, title: t('home.trust.returns.title'), body: t('home.trust.returns.body') },
  ], [t]);

  return (
    <>
      <Helmet>
        <title>NEXORA | {lang === 'ar' ? 'تصاميم هادئة بخامات فاخرة' : 'Soft Luxury Essentials'}</title>
        <meta name="description" content={lang === 'ar' ? 'NEXORA تقدم قطع يومية هادئة بخامات مختارة، طلب واضح، ودفع عند الاستلام.' : 'NEXORA creates soft luxury essentials with refined fabrics, clear COD ordering, and a calm premium shopping experience.'} />
        <meta property="og:title" content="NEXORA | Soft Luxury Essentials" />
        <meta property="og:description" content="Premium essentials, clear COD ordering, and limited releases." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/nexora-logo-bg.jpg" />
        <link rel="canonical" href="/" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'NEXORA',
          url: 'https://nexora1-one.vercel.app',
          logo: 'https://nexora1-one.vercel.app/assets/nexora-logo.png',
          contactPoint: [{ '@type': 'ContactPoint', telephone: '+201037141322', contactType: 'customer support' }],
          sameAs: ['https://wa.me/201037141322'],
        })}</script>
      </Helmet>

      <main className="v3-page pt-20 pb-16">
        <section className="v3-shell grid min-h-[76vh] items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="v3-hero-art">
            <img src="/assets/nexora-logo-dark.png" alt="NEXORA emblem" className="v3-hero-logo dark:hidden" />
            <img src="/assets/nexora-logo-ivory.png" alt="NEXORA emblem" className="v3-hero-logo hidden dark:block" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.8 }} className="v3-hero-copy">
            <img src="/assets/nexora-logo-dark.png" alt="NEXORA" className="h-12 w-auto object-contain opacity-90 dark:hidden" />
            <img src="/assets/nexora-logo-ivory.png" alt="NEXORA" className="hidden h-12 w-auto object-contain opacity-90 dark:block" />
            <p className="v3-kicker mt-7">{t('home.kicker')}</p>
            <h1 className="v3-title mt-4">{t('home.title')}</h1>
            <p className="v3-lead mt-5">{t('home.lead')}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="v3-btn-primary">{t('home.shopNow')} <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/limited" className="v3-btn-secondary">{t('home.exploreLimited')}</Link>
            </div>
          </motion.div>
        </section>

        <section className="v3-shell mt-8 grid gap-4 md:grid-cols-3">
          {categoryTiles.map((tile, index) => (
            <motion.div key={tile.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <Link to={tile.href} className="v3-category-card">
                <img src={tile.image} alt={lang === 'ar' ? tile.ar : tile.title} />
                <div>
                  <h3>{lang === 'ar' ? tile.ar : tile.title}</h3>
                  <span>{lang === 'ar' ? 'تسوق الآن' : 'Explore'} <ArrowRight className="h-3 w-3" /></span>
                </div>
              </Link>
            </motion.div>
          ))}
        </section>

        <section className="v3-shell mt-12">
          <div className="v3-section-head">
            <div>
              <p className="v3-kicker">NEXORA</p>
              <h2>{t('home.featured')}</h2>
            </div>
            <Link to="/shop" className="v3-inline-link">{t('common.viewAll')} <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          {isLoadingProducts ? (
            <div className="v3-panel p-8 text-center text-sm text-[var(--v33-muted)]">{t('common.loading')}</div>
          ) : products.length ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
            </div>
          ) : (
            <div className="v3-panel p-8 text-center text-sm leading-7 text-[var(--v33-muted)]">{t('home.noFeatured')}</div>
          )}
        </section>

        <section className="v3-shell mt-12 grid gap-4 lg:grid-cols-3">
          {trustItems.map(({ icon: Icon, title, body }) => (
            <div key={title} className="v41-trust-card">
              <div className="v41-trust-icon"><Icon className="h-5 w-5" /></div>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="v3-shell mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="v3-panel p-6 md:p-8">
            <div className="v3-section-head mb-6">
              <h2>{t('home.reviewsTitle')}</h2>
              {reviews.length > 0 && <Link to="/reviews" className="v3-inline-link">{t('common.viewAll')} <ArrowRight className="h-3.5 w-3.5" /></Link>}
            </div>
            {reviews.length ? (
              <div className="grid gap-4 md:grid-cols-3">
                {reviews.map((review) => (
                  <div className="v3-review-card" key={review.id}>
                    {review.images?.[0] && <img src={review.images[0]} alt={review.customerName} className="mb-4 h-24 w-full rounded-2xl object-cover" />}
                    <StarRating rating={review.rating} size={13} />
                    <p>“{review.body}”</p>
                    <strong>{review.customerName}</strong>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-[var(--v33-border)] bg-[var(--v33-bg-soft)]/40 p-6 text-sm leading-7 text-[var(--v33-muted)]">
                {t('home.noReviews')}
              </div>
            )}
          </div>
          <div className="v3-panel p-6 md:p-8">
            <ShieldCheck className="mb-5 h-8 w-8 text-[var(--v33-accent-strong)]" />
            <h2 className="text-xl font-semibold text-[var(--v33-text)]">{t('home.aboutTitle')}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--v33-muted)]">{t('home.aboutBody')}</p>
            <Link to="/info/about" className="v3-btn-secondary mt-6 inline-flex">{lang === 'ar' ? 'اعرف أكثر' : 'Learn More'} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
    </>
  );
}
