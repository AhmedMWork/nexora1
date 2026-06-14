// ============================================================
// NEXORA — Reviews Section (Homepage)
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import type { Review } from '@/types';

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [featuredReviews, setFeaturedReviews] = useState<Review[]>([]);

  useEffect(() => {
    let mounted = true;
    import('@/lib/supabase/db')
      .then(({ getReviews }) => getReviews({ isApproved: true, isFeatured: true }))
      .then((reviews) => { if (mounted) setFeaturedReviews(reviews.slice(0, 8)); })
      .catch(() => { if (mounted) setFeaturedReviews([]); });
    return () => { mounted = false; };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  if (featuredReviews.length === 0) return null;

  return (
    <section className="py-20 lg:py-32 bg-[#050505]">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <SectionReveal className="flex items-end justify-between mb-12">
          <div>
            <p className="nexora-caption text-[#c8a96a] mb-3">Testimonials</p>
            <h2 className="nexora-heading-md">WHAT THEY SAY</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 flex items-center justify-center border border-[#202024] text-[#b8b0a3] hover:border-[#c8a96a] hover:text-[#c8a96a] transition-colors" aria-label="Scroll reviews left">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 flex items-center justify-center border border-[#202024] text-[#b8b0a3] hover:border-[#c8a96a] hover:text-[#c8a96a] transition-colors" aria-label="Scroll reviews right">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </SectionReveal>

        <div ref={scrollRef} className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {featuredReviews.map((review, i) => (
            <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex-shrink-0 w-[340px] sm:w-[400px] p-6 bg-[#0b0b0d] border border-[#17171a]">
              <Quote className="w-6 h-6 text-[#c8a96a]/30 mb-4" />
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-[#c8a96a] fill-[#c8a96a]' : 'text-[#2a2a2d]'}`} />
                ))}
              </div>
              <h4 className="text-sm font-semibold text-[#f4f0e8] mb-2">{review.title}</h4>
              <p className="text-xs text-[#b8b0a3] leading-relaxed mb-4">{review.body}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8a8175]">{review.customerName}</span>
                <span className="text-[10px] text-[#6f675d] uppercase tracking-wider">{review.productName}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/reviews" className="nexora-button inline-flex items-center gap-2">Read All Reviews</Link>
        </div>
      </div>
    </section>
  );
}
