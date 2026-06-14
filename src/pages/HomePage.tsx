// ============================================================
// NEXORA V3 — Soft Luxury Editorial Homepage
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import StarRating from '@/components/ui/StarRating';
import type { Product, Review } from '@/types';
import { loadProducts } from '@/services/productService';
import { useI18n } from '@/i18n/I18nProvider';

const categoryTiles = [
  { title: 'Oversized Tees', ar: 'تيشيرتات واسعة', href: '/shop/unisex', image: '/assets/products/women-sand-tee.jpg' },
  { title: 'Hoodies', ar: 'هوديز', href: '/shop/unisex', image: '/assets/products/men-gray-tee.jpg' },
  { title: 'Limited', ar: 'المحدود', href: '/limited', image: '/assets/nexora-logo-bg.jpg' },
];

const staticReviews = [
  { name: 'Yasmine S.', body: 'Premium fabric, simple design, and a fit that feels considered.', ar: 'خامات راقية وتصميم بسيط وقصة مريحة جدًا.' },
  { name: 'Ahmed H.', body: 'The order arrived cleanly packed. NEXORA feels like a real brand.', ar: 'التغليف كان ممتاز والمنتج فعلاً له إحساس براند حقيقي.' },
  { name: 'Khaled B.', body: 'Quiet design, elevated finish, and everyday comfort.', ar: 'تصميم هادئ وتشطيب راقٍ وراحة مناسبة لكل يوم.' },
];

export default function HomePage() {
  const { lang } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let mounted = true;
    loadProducts({ isFeatured: true }).then((items) => {
      if (mounted) setProducts(items.slice(0, 4));
    });
    import('@/lib/supabase/db')
      .then(({ getReviews }) => getReviews({ isApproved: true, isFeatured: true }))
      .then((items) => { if (mounted) setReviews(items.slice(0, 3)); })
      .catch(() => { if (mounted) setReviews([]); });
    return () => { mounted = false; };
  }, []);

  const reviewCards = useMemo(() => reviews.length ? reviews.map((r) => ({ name: r.customerName, body: r.body, ar: r.body })) : staticReviews, [reviews]);

  return (
    <>
      <Helmet>
        <title>NEXORA | Soft Luxury Essentials</title>
        <meta name="description" content="NEXORA creates soft luxury essentials for men, women, and unisex everyday silhouettes. Quiet design, premium fabrics, and modern comfort." />
        <meta property="og:title" content="NEXORA | Soft Luxury Essentials" />
        <meta property="og:description" content="A quiet editorial shopping experience for premium essentials." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/nexora-logo-bg.jpg" />
        <link rel="canonical" href="/" />
      </Helmet>

      <main className="v3-page pt-20 pb-16">
        <section className="v3-shell grid min-h-[76vh] items-center gap-8 lg:grid-cols-[1fr_1.05fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="v3-hero-art">
            <img src="/assets/nexora-logo-dark.png" alt="NEXORA emblem" className="v3-hero-logo dark:hidden" /><img src="/assets/nexora-logo-ivory.png" alt="NEXORA emblem" className="v3-hero-logo hidden dark:block" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.8 }} className="v3-hero-copy">
            <img src="/assets/nexora-logo-dark.png" alt="NEXORA" className="h-12 w-auto object-contain opacity-90 dark:hidden" /><img src="/assets/nexora-logo-ivory.png" alt="NEXORA" className="hidden h-12 w-auto object-contain opacity-90 dark:block" />
            <p className="v3-kicker mt-7">Built for the next generation</p>
            <h1 className="v3-title mt-4">{lang === 'ar' ? 'تصاميم هادئة بخامات فاخرة' : 'Premium essentials with a quiet edge'}</h1>
            <p className="v3-lead mt-5">
              {lang === 'ar'
                ? 'تجربة أزياء ناعمة تجمع بين الراحة والتفاصيل النظيفة والحضور العصري.'
                : 'Soft silhouettes, refined fabrics, and a calm editorial experience made for everyday confidence.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="v3-btn-primary">{lang === 'ar' ? 'تسوق الآن' : 'Shop Now'} <ArrowRight className="h-4 w-4" /></Link>
              <Link to="/limited" className="v3-btn-secondary">{lang === 'ar' ? 'استكشف المحدود' : 'Explore Limited'}</Link>
            </div>
          </motion.div>
        </section>

        <section className="v3-shell mt-8 grid gap-4 md:grid-cols-3">
          {categoryTiles.map((tile, index) => (
            <motion.div key={tile.title} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}>
              <Link to={tile.href} className="v3-category-card">
                <img src={tile.image} alt={tile.title} />
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
              <p className="v3-kicker">Featured Products</p>
              <h2>{lang === 'ar' ? 'المنتجات المميزة' : 'Featured Products'}</h2>
            </div>
            <Link to="/shop" className="v3-inline-link">{lang === 'ar' ? 'عرض الكل' : 'View all'} <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
          </div>
        </section>

        <section className="v3-shell mt-12 grid gap-4 lg:grid-cols-3">
          {[
            { icon: Truck, title: lang === 'ar' ? 'شحن سريع' : 'Fast Delivery', body: lang === 'ar' ? 'داخل ٢–٤ أيام عمل' : 'Within 2–4 business days' },
            { icon: Sparkles, title: lang === 'ar' ? 'جودة فاخرة' : 'Premium Quality', body: lang === 'ar' ? 'خامات مختارة بعناية' : 'Carefully selected fabrics' },
            { icon: RotateCcw, title: lang === 'ar' ? 'استبدال سهل' : 'Easy Exchange', body: lang === 'ar' ? 'خلال 14 يومًا' : 'Within 14 days' },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="v3-service-card"><Icon className="h-6 w-6" /><div><h3>{title}</h3><p>{body}</p></div></div>
          ))}
        </section>

        <section className="v3-shell mt-12 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="v3-panel p-6 md:p-8">
            <div className="v3-section-head mb-6"><h2>{lang === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}</h2><Link to="/reviews" className="v3-inline-link">{lang === 'ar' ? 'عرض الكل' : 'View all'} <ArrowRight className="h-3.5 w-3.5" /></Link></div>
            <div className="grid gap-4 md:grid-cols-3">
              {reviewCards.map((review) => (
                <div className="v3-review-card" key={review.name}>
                  <StarRating rating={5} size={13} />
                  <p>“{lang === 'ar' ? review.ar : review.body}”</p>
                  <strong>{review.name}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="v3-panel p-6 md:p-8">
            <ShieldCheck className="mb-5 h-8 w-8 text-[#A97868] dark:text-[#C7A191]" />
            <h2 className="text-xl font-semibold text-[#5C4A42] dark:text-[#E9DED3]">{lang === 'ar' ? 'عن نيكسورا' : 'About NEXORA'}</h2>
            <p className="mt-4 text-sm leading-7 text-[#8A7A72] dark:text-[#BBAEA4]">{lang === 'ar' ? 'نيكسورا أكثر من ملابس. تجربة هادئة بتفاصيل فاخرة لأسلوب مختلف.' : 'NEXORA is more than clothing. It is a quiet statement of comfort, confidence, and refined detail.'}</p>
            <Link to="/info/about" className="v3-btn-secondary mt-6 inline-flex">{lang === 'ar' ? 'اعرف أكثر' : 'Learn More'} <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </section>
      </main>
    </>
  );
}
