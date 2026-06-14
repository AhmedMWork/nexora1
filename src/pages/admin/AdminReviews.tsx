// ============================================================
// NEXORA V3 — Studio Reviews Manager
// Reviews are admin-created only. Customers can view approved reviews, not submit them.
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Star, Trash2, RefreshCw, Plus, Eye, EyeOff } from 'lucide-react';
import type { Review } from '@/types';
import toast from 'react-hot-toast';

interface ReviewDraft {
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  isApproved: boolean;
  isFeatured: boolean;
  helpfulCount: number;
}

const emptyDraft: ReviewDraft = {
  productId: 'brand',
  productName: 'NEXORA Experience',
  customerName: '',
  rating: 5,
  title: '',
  body: '',
  isApproved: true,
  isFeatured: true,
  helpfulCount: 0,
};

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'hidden' | 'featured'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [draft, setDraft] = useState<ReviewDraft>(emptyDraft);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const { getReviews } = await import('@/lib/supabase/db');
      setReviews(await getReviews());
    } catch {
      toast.error('Could not load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const filteredReviews = useMemo(() => {
    if (filter === 'published') return reviews.filter((r) => r.isApproved);
    if (filter === 'hidden') return reviews.filter((r) => !r.isApproved);
    if (filter === 'featured') return reviews.filter((r) => r.isFeatured);
    return reviews;
  }, [reviews, filter]);

  const createStudioReview = async () => {
    if (!draft.customerName.trim() || !draft.title.trim() || !draft.body.trim()) {
      toast.error('Name, title, and body are required');
      return;
    }
    try {
      const { createReview } = await import('@/lib/supabase/db');
      await createReview({ ...draft, images: [] });
      toast.success('Review published from Studio');
      setDraft(emptyDraft);
      setIsCreating(false);
      loadReviews();
    } catch {
      toast.error('Could not create review');
    }
  };

  const toggleReviewVisibility = async (review: Review) => {
    try {
      const { updateReview } = await import('@/lib/supabase/db');
      await updateReview(review.id, { isApproved: !review.isApproved });
      setReviews((current) => current.map((r) => r.id === review.id ? { ...r, isApproved: !r.isApproved } : r));
      toast.success(review.isApproved ? 'Review hidden' : 'Review published');
    } catch {
      toast.error('Could not update review');
    }
  };

  const deleteReviewById = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const { deleteReview } = await import('@/lib/supabase/db');
      await deleteReview(id);
      setReviews((current) => current.filter((r) => r.id !== id));
      toast.success('Review deleted');
    } catch {
      toast.error('Could not delete review');
    }
  };

  const updateDraft = <K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-[#f4f0e8]">Studio Reviews</h1>
          <p className="text-xs text-[#8a8175] mt-1">Only Studio admins can create or publish reviews. Customer submissions are disabled.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'published', 'hidden', 'featured'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-[10px] uppercase tracking-wider border transition-colors ${filter === f ? 'border-[#C7A191] text-[#C7A191]' : 'border-[#4A3D37] text-[#A99A91] hover:border-[#76675F]'}`}>{f}</button>
          ))}
          <button onClick={loadReviews} className="nexora-button flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
          <button onClick={() => setIsCreating((v) => !v)} className="nexora-button-primary flex items-center gap-2"><Plus className="w-3.5 h-3.5" />Add Review</button>
        </div>
      </div>

      {isCreating && (
        <div className="p-5 bg-[#231D1A] border border-[#4A3D37] rounded-2xl space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <input className="admin-input rounded-xl" placeholder="Display name" value={draft.customerName} onChange={(e) => updateDraft('customerName', e.target.value)} />
            <input className="admin-input rounded-xl" placeholder="Product / brand context" value={draft.productName} onChange={(e) => updateDraft('productName', e.target.value)} />
            <input className="admin-input rounded-xl" placeholder="Title" value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} />
            <select className="admin-input rounded-xl" value={draft.rating} onChange={(e) => updateDraft('rating', Number(e.target.value))}>
              {[5,4,3,2,1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
            </select>
            <textarea className="admin-input rounded-xl sm:col-span-2" rows={4} placeholder="Review body" value={draft.body} onChange={(e) => updateDraft('body', e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#BBAEA4]">
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.isApproved} onChange={(e) => updateDraft('isApproved', e.target.checked)} /> Published</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.isFeatured} onChange={(e) => updateDraft('isFeatured', e.target.checked)} /> Featured</label>
          </div>
          <div className="flex gap-3"><button onClick={() => setIsCreating(false)} className="nexora-button">Cancel</button><button onClick={createStudioReview} className="nexora-button-primary">Publish Review</button></div>
        </div>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#8a8175] bg-[#231D1A] border border-[#4A3D37] rounded-2xl">Loading reviews...</div>
        ) : filteredReviews.length ? filteredReviews.map((review) => (
          <div key={review.id} className={`p-5 bg-[#231D1A] border ${review.isApproved ? 'border-[#4A3D37]' : 'border-[#8A6A5E]'} rounded-2xl transition-all`}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-[#C7A191] fill-[#C7A191]' : 'text-[#4A3D37]'}`} />)}</div>
                  <span className="text-xs text-[#E9DED3] font-medium">{review.title}</span>
                </div>
                <p className="text-[10px] text-[#A99A91]">by {review.customerName} — {review.productName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleReviewVisibility(review)} className="p-1.5 text-[#A99A91] hover:text-[#C7A191]" title={review.isApproved ? 'Hide' : 'Publish'}>{review.isApproved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                <button onClick={() => deleteReviewById(review.id)} className="p-1.5 text-[#A99A91] hover:text-red-400" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-xs text-[#BBAEA4] leading-relaxed">{review.body}</p>
            <div className="mt-3 flex items-center gap-4">
              {review.isApproved ? <span className="text-[10px] px-2 py-0.5 bg-[#C7A191]/10 text-[#C7A191] uppercase tracking-wider">Published</span> : <span className="text-[10px] px-2 py-0.5 bg-[#8A6A5E]/10 text-[#D7B5A7] uppercase tracking-wider">Hidden</span>}
              {review.isFeatured && <span className="text-[10px] px-2 py-0.5 bg-[#C7A191]/10 text-[#C7A191] uppercase tracking-wider">Featured</span>}
            </div>
          </div>
        )) : (
          <div className="p-8 text-center text-xs text-[#8a8175] bg-[#231D1A] border border-[#4A3D37] rounded-2xl">No reviews created yet</div>
        )}
      </div>
    </div>
  );
}
