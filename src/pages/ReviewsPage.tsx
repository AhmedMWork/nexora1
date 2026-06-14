// ============================================================
// NEXORA V3 — Studio Curated Reviews
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Star, Quote, ThumbsUp } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import StarRating from '@/components/ui/StarRating';
import type { Review } from '@/types';

export default function ReviewsPage() {
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
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <>
      <Helmet>
        <title>Reviews | NEXORA — Curated Customer Notes</title>
        <meta name="description" content="Read curated customer notes selected by NEXORA." />
      </Helmet>

      <div className="pt-24 pb-20 bg-[#050505] min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <p className="nexora-caption text-[#c8a96a] mb-3">Studio Curated</p>
            <h1 className="nexora-heading-md mb-8">CURATED REVIEWS</h1>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <div className="grid sm:grid-cols-2 gap-6 p-6 bg-[#0b0b0d] border border-[#17171a] mb-10">
              <div className="flex flex-col items-center justify-center">
                <p className="text-5xl font-bold text-[#f4f0e8]">{averageRating ? averageRating.toFixed(1) : '—'}</p>
                <StarRating rating={averageRating} size={18} className="my-2" />
                <p className="text-xs text-[#8a8175]">Published by NEXORA Studio · {reviews.length} notes</p>
              </div>
              <div className="space-y-2">
                {ratingCounts.map(({ rating, count }) => (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-xs text-[#b8b0a3] w-3">{rating}</span>
                    <Star className="w-3 h-3 text-[#c8a96a] fill-[#c8a96a]" />
                    <div className="flex-1 h-1.5 bg-[#17171a]">
                      <div className="h-full bg-[#c8a96a]" style={{ width: `${reviews.length ? (count / reviews.length) * 100 : 0}%` }} />
                    </div>
                    <span className="text-[10px] text-[#8a8175] w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>

          {isLoading ? (
            <div className="p-10 text-center text-xs text-[#8a8175] bg-[#0b0b0d] border border-[#17171a]">Loading reviews...</div>
          ) : reviews.length ? (
            <div className="grid md:grid-cols-2 gap-4">
              {reviews.map((review, i) => (
                <SectionReveal key={review.id} delay={i * 0.05}>
                  <div className="p-5 bg-[#0b0b0d] border border-[#17171a] h-full">
                    <Quote className="w-5 h-5 text-[#c8a96a]/20 mb-3" />
                    <StarRating rating={review.rating} size={12} className="mb-3" />
                    <h4 className="text-sm font-semibold text-[#f4f0e8] mb-2">{review.title}</h4>
                    <p className="text-xs text-[#b8b0a3] leading-relaxed mb-4">{review.body}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-[#f4f0e8]">{review.customerName}</p>
                        <p className="text-[10px] text-[#8a8175]">{review.productName}</p>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-[#8a8175]"><ThumbsUp className="w-3 h-3" />{review.helpfulCount || 0}</span>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-[#8a8175] bg-[#0b0b0d] border border-[#17171a]">No reviews have been published yet.</div>
          )}
        </div>
      </div>
    </>
  );
}
