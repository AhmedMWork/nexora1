import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff, ImagePlus, Plus, RefreshCw, Star, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadProductImage } from '@/services/upload.service';
import type { Review } from '@/types';

interface ReviewDraft {
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
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
  images: [],
  isApproved: true,
  isFeatured: true,
  helpfulCount: 0,
};

const ratingOptions = Array.from({ length: 10 }, (_, index) => (index + 1) / 2);

function Field({ label, help, children }: { label: string; help: string; children: React.ReactNode }) {
  return <div className="studio-field"><label>{label}</label>{children}<p className="studio-help">{help}</p></div>;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<'all' | 'published' | 'hidden' | 'featured'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [draft, setDraft] = useState<ReviewDraft>(emptyDraft);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const { getReviews } = await import('@/lib/supabase/db');
      setReviews(await getReviews());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadReviews(); }, []);

  const filteredReviews = useMemo(() => {
    if (filter === 'published') return reviews.filter((r) => r.isApproved);
    if (filter === 'hidden') return reviews.filter((r) => !r.isApproved);
    if (filter === 'featured') return reviews.filter((r) => r.isFeatured);
    return reviews;
  }, [reviews, filter]);

  const updateDraft = <K extends keyof ReviewDraft>(key: K, value: ReviewDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  const uploadReviewImage = async (file?: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadProductImage(file, 'reviews');
      updateDraft('images', [...draft.images, url]);
      toast.success('Review image uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not upload review image');
    } finally {
      setIsUploading(false);
    }
  };

  const createStudioReview = async () => {
    if (!draft.customerName.trim() || !draft.body.trim()) {
      toast.error('Customer name and review body are required');
      return;
    }
    try {
      const { createReview } = await import('@/lib/supabase/db');
      await createReview(draft);
      toast.success('Review saved');
      setDraft(emptyDraft);
      setIsCreating(false);
      void loadReviews();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not create review');
    }
  };

  const toggleReviewVisibility = async (review: Review) => {
    try {
      const { updateReview } = await import('@/lib/supabase/db');
      await updateReview(review.id, { isApproved: !review.isApproved });
      setReviews((current) => current.map((r) => r.id === review.id ? { ...r, isApproved: !r.isApproved } : r));
      toast.success(review.isApproved ? 'Review hidden' : 'Review published');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update review');
    }
  };

  const deleteReviewById = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      const { deleteReview } = await import('@/lib/supabase/db');
      await deleteReview(id);
      setReviews((current) => current.filter((r) => r.id !== id));
      toast.success('Review deleted');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete review');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#FFF0E1]">Studio Reviews</h1>
          <p className="mt-1 text-sm text-[#BCAEA0]">Add customer reviews with optional images and half-star ratings. Customers cannot submit reviews publicly.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'published', 'hidden', 'featured'] as const).map((f) => <button key={f} onClick={() => setFilter(f)} data-active={filter === f} className="studio-chip">{f}</button>)}
          <button onClick={loadReviews} className="nexora-button"><RefreshCw className="h-4 w-4" />Refresh</button>
          <button onClick={() => setIsCreating((v) => !v)} className="nexora-button-primary"><Plus className="h-4 w-4" />Add Review</button>
        </div>
      </div>

      {isCreating && (
        <div className="studio-card p-5 sm:p-7 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Customer display name" help="Shown on the public reviews page. Example: Yasmine S."><input className="studio-input" value={draft.customerName} onChange={(e) => updateDraft('customerName', e.target.value)} /></Field>
            <Field label="Product or context" help="Example: NEXORA Signature Tee or NEXORA Experience."><input className="studio-input" value={draft.productName} onChange={(e) => updateDraft('productName', e.target.value)} /></Field>
            <Field label="Title" help="Short headline. Optional but useful for scanning."><input className="studio-input" value={draft.title} onChange={(e) => updateDraft('title', e.target.value)} /></Field>
            <Field label="Rating" help="Supports 0.5 increments from 0.5 to 5."><select className="studio-input" value={draft.rating} onChange={(e) => updateDraft('rating', Number(e.target.value))}>{ratingOptions.map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}</select></Field>
            <Field label="Review text" help="Write a real, clear customer note. Avoid fake or exaggerated wording."><textarea className="studio-input" rows={5} value={draft.body} onChange={(e) => updateDraft('body', e.target.value)} /></Field>
            <Field label="Review image" help="Optional. Upload a customer/photo proof image. The first image appears on the public card.">
              <label className="nexora-button cursor-pointer"><ImagePlus className="h-4 w-4" />{isUploading ? 'Uploading...' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => uploadReviewImage(e.target.files?.[0])} /></label>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {draft.images.map((url) => <div key={url} className="relative"><img src={url} alt="review" className="h-24 w-full rounded-2xl object-cover" /><button onClick={() => updateDraft('images', draft.images.filter((img) => img !== url))} className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white"><X className="h-3 w-3" /></button></div>)}
              </div>
            </Field>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#BCAEA0]">
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.isApproved} onChange={(e) => updateDraft('isApproved', e.target.checked)} /> Published</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={draft.isFeatured} onChange={(e) => updateDraft('isFeatured', e.target.checked)} /> Featured on Home</label>
          </div>
          <div className="flex gap-3"><button onClick={() => setIsCreating(false)} className="nexora-button">Cancel</button><button onClick={createStudioReview} className="nexora-button-primary">Save Review</button></div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        {isLoading ? (
          <div className="studio-card p-8 text-center text-sm text-[#BCAEA0]">Loading reviews...</div>
        ) : filteredReviews.length ? filteredReviews.map((review) => (
          <article key={review.id} className="studio-card p-5">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`h-3.5 w-3.5 ${i + 1 <= Math.ceil(review.rating) ? 'fill-[#D2B48C] text-[#D2B48C]' : 'text-[#5B473C]'}`} />)}</div>
                  <span className="text-xs font-medium text-[#FFF0E1]">{review.rating.toFixed(1)}</span>
                </div>
                <h2 className="text-sm font-semibold text-[#FFF0E1]">{review.title || review.customerName}</h2>
                <p className="text-[10px] text-[#BCAEA0]">by {review.customerName} — {review.productName}</p>
              </div>
              <div className="flex gap-2"><button onClick={() => toggleReviewVisibility(review)} className="text-[#BCAEA0] hover:text-[#D2B48C]">{review.isApproved ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button><button onClick={() => deleteReviewById(review.id)} className="text-[#BCAEA0] hover:text-red-300"><Trash2 className="h-4 w-4" /></button></div>
            </div>
            {review.images?.[0] && <img src={review.images[0]} alt={review.customerName} className="mb-4 h-36 w-full rounded-2xl object-cover" />}
            <p className="text-sm leading-7 text-[#D2C0B0]">{review.body}</p>
            <div className="mt-4 flex gap-2">{review.isApproved && <span className="studio-chip" data-active="true">Published</span>}{review.isFeatured && <span className="studio-chip" data-active="true">Featured</span>}</div>
          </article>
        )) : (
          <div className="studio-card p-8 text-center text-sm text-[#BCAEA0]">No reviews created yet</div>
        )}
      </div>
    </div>
  );
}
