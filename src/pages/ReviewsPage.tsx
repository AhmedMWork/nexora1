import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Quote, Star } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import StarRating from '@/components/ui/StarRating';
import type { Review } from '@/types';
import { useI18n } from '@/i18n/I18nProvider';

export default function ReviewsPage() {
  const { lang, t } = useI18n();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    import('@/lib/supabase/db')
      .then(({ getReviews }) => getReviews({ isApproved: true }))
      .then((loadedReviews) => { if (mounted) setReviews(loadedReviews); })
      .catch(() => { if (mounted) setReviews([]); })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, []);

  const averageRating = useMemo(() => (
    reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0
  ), [reviews]);

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => Math.floor(r.rating) === rating).length,
  }));

  return (
    <>
      <Helmet>
        <title>{lang === 'ar' ? 'التقييمات' : 'Reviews'} | NEXORA</title>
        <meta name="description" content={lang === 'ar' ? 'تقييمات منشورة من NEXORA Studio.' : 'Published NEXORA Studio customer reviews.'} />
      </Helmet>

      <main className="min-h-screen bg-[var(--v33-bg)] pt-24 pb-20 text-[var(--v33-text)]">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <p className="v3-kicker mb-3">NEXORA</p>
            <h1 className="nexora-heading-md mb-4">{lang === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}</h1>
            <p className="max-w-2xl text-sm leading-7 text-[var(--v33-muted)]">
              {lang === 'ar' ? 'كل التقييمات الظاهرة هنا منشورة من لوحة NEXORA Studio فقط.' : 'Every review shown here is curated and published from NEXORA Studio.'}
            </p>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="my-10 grid gap-6 rounded-[28px] border border-[var(--v33-border)] bg-[var(--v33-card)] p-6 shadow-[0_24px_70px_var(--v33-shadow)] sm:grid-cols-2">
              <div className="flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-[var(--v33-text)]">{averageRating ? averageRating.toFixed(1) : '—'}</p>
                <StarRating rating={averageRating} size={18} className="my-2" />
                <p className="text-xs text-[var(--v33-muted)]">{reviews.length} {lang === 'ar' ? 'تقييم منشور' : 'published reviews'}</p>
              </div>
              <div className="space-y-2">
                {ratingCounts.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="w-3 text-xs text-[var(--v33-muted)]">{rating}</span>
                    <Star className="h-3 w-3 fill-[var(--v33-accent)] text-[var(--v33-accent)]" />
                    <div className="h-1.5 flex-1 rounded-full bg-[var(--v33-bg-soft)]">
                      <div className="h-full rounded-full bg-[var(--v33-accent)]" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
                    </div>
                    <span className="w-6 text-right text-[10px] text-[var(--v33-muted)]">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {isLoading ? (
            <div className="rounded-[24px] border border-[var(--v33-border)] bg-[var(--v33-card)] p-10 text-center text-sm text-[var(--v33-muted)]">{t('common.loading')}</div>
          ) : reviews.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review, i) => (
                <SectionReveal key={review.id} delay={i * 0.04}>
                  <article className="h-full rounded-[28px] border border-[var(--v33-border)] bg-[var(--v33-card)] p-5 shadow-[0_24px_70px_var(--v33-shadow)]">
                    {review.images?.[0] && <img src={review.images[0]} alt={review.customerName} className="mb-5 h-48 w-full rounded-[22px] object-cover" />}
                    <Quote className="mb-3 h-5 w-5 text-[var(--v33-accent)]/40" />
                    <StarRating rating={review.rating} size={13} className="mb-3" />
                    {review.title && <h2 className="mb-2 text-sm font-semibold text-[var(--v33-text)]">{review.title}</h2>}
                    <p className="mb-5 text-sm leading-7 text-[var(--v33-muted)]">{review.body}</p>
                    <div className="border-t border-[var(--v33-border)] pt-4">
                      <p className="text-sm font-semibold text-[var(--v33-text)]">{review.customerName}</p>
                      {review.productName && <p className="text-xs text-[var(--v33-subtle)]">{review.productName}</p>}
                    </div>
                  </article>
                </SectionReveal>
              ))}
            </div>
          ) : (
            <div className="rounded-[28px] border border-[var(--v33-border)] bg-[var(--v33-card)] p-10 text-center text-sm leading-7 text-[var(--v33-muted)]">
              {lang === 'ar' ? 'لا توجد تقييمات منشورة حتى الآن. عندما تنشر تقييمًا من لوحة التحكم سيظهر هنا.' : 'No reviews are published yet. Once you publish reviews from Studio, they will appear here.'}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
