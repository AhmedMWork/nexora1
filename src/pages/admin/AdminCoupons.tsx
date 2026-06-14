// ============================================================
// NEXORA — Admin Coupons Page
// Complete discount-code control: value, dates, limits, targeting
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Plus, Tag, Trash2, Edit, X, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Coupon, DiscountType } from '@/types';
import { formatPrice, formatTimestamp } from '@/lib/utils';

type CouponDraft = {
  code: string;
  title: string;
  description: string;
  type: DiscountType;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  usageLimit: number;
  perCustomerLimit: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  status: Coupon['status'];
  allowedProductIds: string;
  excludedProductIds: string;
  allowedCategories: string;
  excludedCategories: string;
  allowedCollections: string;
  excludedCollections: string;
  firstOrderOnly: boolean;
};

const emptyDraft: CouponDraft = {
  code: '',
  title: '',
  description: '',
  type: 'percentage',
  value: 10,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  usageLimit: 100,
  perCustomerLimit: 1,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  isActive: true,
  status: 'active',
  allowedProductIds: '',
  excludedProductIds: '',
  allowedCategories: '',
  excludedCategories: '',
  allowedCollections: '',
  excludedCollections: '',
  firstOrderOnly: false,
};

function toInputDate(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  return new Date(value as string | number).toISOString().slice(0, 10);
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [draft, setDraft] = useState<CouponDraft>(emptyDraft);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const { getCoupons } = await import('@/lib/supabase/db');
      setCoupons(await getCoupons());
    } catch {
      toast.error('Could not load coupons');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadCoupons(); }, []);

  const filtered = useMemo(() => coupons.filter((coupon) => {
    const q = query.trim().toLowerCase();
    return !q || coupon.code.toLowerCase().includes(q) || coupon.title?.toLowerCase().includes(q);
  }), [coupons, query]);

  const openCreate = () => { setEditingCoupon(null); setDraft(emptyDraft); setShowForm(true); };
  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setDraft({
      code: coupon.code,
      title: coupon.title || '',
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      usageLimit: coupon.usageLimit || 0,
      perCustomerLimit: coupon.perCustomerLimit || 1,
      startDate: toInputDate(coupon.startDate),
      endDate: toInputDate(coupon.endDate),
      isActive: coupon.isActive,
      status: coupon.status || (coupon.isActive ? 'active' : 'paused'),
      allowedProductIds: coupon.allowedProductIds?.join(', ') || '',
      excludedProductIds: coupon.excludedProductIds?.join(', ') || '',
      allowedCategories: coupon.allowedCategories?.join(', ') || '',
      excludedCategories: coupon.excludedCategories?.join(', ') || '',
      allowedCollections: coupon.allowedCollections?.join(', ') || '',
      excludedCollections: coupon.excludedCollections?.join(', ') || '',
      firstOrderOnly: !!coupon.firstOrderOnly,
    });
    setShowForm(true);
  };

  const saveCoupon = async () => {
    if (!draft.code.trim()) return toast.error('Coupon code is required');
    if (draft.value < 0) return toast.error('Discount value must be valid');
    if (!draft.startDate || !draft.endDate) return toast.error('Start and end dates are required');
    setIsSaving(true);
    try {
      const payload = {
        code: draft.code.trim().toUpperCase(),
        title: draft.title.trim(),
        description: draft.description.trim(),
        type: draft.type,
        value: Number(draft.value),
        minOrderAmount: Number(draft.minOrderAmount || 0),
        maxDiscountAmount: draft.maxDiscountAmount ? Number(draft.maxDiscountAmount) : undefined,
        usageLimit: Number(draft.usageLimit || 0),
        usedCount: editingCoupon?.usedCount || 0,
        perCustomerLimit: Number(draft.perCustomerLimit || 1),
        startDate: new Date(draft.startDate),
        endDate: new Date(draft.endDate),
        isActive: draft.isActive,
        status: draft.status,
        allowedProductIds: draft.allowedProductIds.split(',').map((v) => v.trim()).filter(Boolean),
        excludedProductIds: draft.excludedProductIds.split(',').map((v) => v.trim()).filter(Boolean),
        allowedCategories: draft.allowedCategories.split(',').map((v) => v.trim()).filter(Boolean),
        excludedCategories: draft.excludedCategories.split(',').map((v) => v.trim()).filter(Boolean),
        allowedCollections: draft.allowedCollections.split(',').map((v) => v.trim()).filter(Boolean),
        excludedCollections: draft.excludedCollections.split(',').map((v) => v.trim()).filter(Boolean),
        firstOrderOnly: draft.firstOrderOnly,
      };
      const { createCoupon, updateCoupon } = await import('@/lib/supabase/db');
      if (editingCoupon) await updateCoupon(editingCoupon.id, payload);
      else await createCoupon(payload);
      toast.success(editingCoupon ? 'Coupon updated' : 'Coupon created');
      setShowForm(false);
      await loadCoupons();
    } catch {
      toast.error('Could not save coupon');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const { updateCoupon } = await import('@/lib/supabase/db');
      await updateCoupon(coupon.id, { isActive: !coupon.isActive, status: !coupon.isActive ? 'active' : 'paused' });
      await loadCoupons();
      toast.success('Coupon status updated');
    } catch { toast.error('Could not update coupon'); }
  };

  const removeCoupon = async (coupon: Coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return;
    try {
      const { deleteCoupon } = await import('@/lib/supabase/db');
      await deleteCoupon(coupon.id);
      await loadCoupons();
      toast.success('Coupon deleted');
    } catch { toast.error('Could not delete coupon'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-[#f4f0e8]">Coupons</h1>
          <p className="text-xs text-[#8a8175] mt-1">Control discount codes, usage limits, targeting, and date windows</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search coupons..." className="bg-[#0b0b0d] border border-[#202024] px-3 py-2.5 text-xs text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]" />
          <button onClick={loadCoupons} className="nexora-button flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#c8a96a] text-[#050505] text-xs font-bold tracking-wider uppercase hover:bg-[#d8bc7e]"><Plus className="w-3.5 h-3.5" />Add Coupon</button>
        </div>
      </div>

      {showForm && (
        <div className="p-5 bg-[#0b0b0d] border border-[#17171a]">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-[#f4f0e8]">{editingCoupon ? 'Edit Coupon' : 'New Coupon'}</h3>
            <button onClick={() => setShowForm(false)} className="text-[#8a8175] hover:text-[#f4f0e8]"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Field label="Code"><input value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} className="admin-input" placeholder="SUMMER25" /></Field>
            <Field label="Title"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="admin-input" placeholder="Summer Drop" /></Field>
            <Field label="Type"><select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as DiscountType })} className="admin-input"><option value="percentage">Percentage</option><option value="fixed">Fixed Amount</option><option value="free_shipping">Free Shipping</option></select></Field>
            <Field label="Value"><input type="number" value={draft.value} onChange={(e) => setDraft({ ...draft, value: Number(e.target.value) })} className="admin-input" /></Field>
            <Field label="Minimum Order"><input type="number" value={draft.minOrderAmount} onChange={(e) => setDraft({ ...draft, minOrderAmount: Number(e.target.value) })} className="admin-input" /></Field>
            <Field label="Maximum Discount"><input type="number" value={draft.maxDiscountAmount} onChange={(e) => setDraft({ ...draft, maxDiscountAmount: Number(e.target.value) })} className="admin-input" /></Field>
            <Field label="Usage Limit"><input type="number" value={draft.usageLimit} onChange={(e) => setDraft({ ...draft, usageLimit: Number(e.target.value) })} className="admin-input" /></Field>
            <Field label="Per Customer"><input type="number" value={draft.perCustomerLimit} onChange={(e) => setDraft({ ...draft, perCustomerLimit: Number(e.target.value) })} className="admin-input" /></Field>
            <Field label="Start Date"><input type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} className="admin-input" /></Field>
            <Field label="End Date"><input type="date" value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} className="admin-input" /></Field>
            <Field label="Status"><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Coupon['status'], isActive: e.target.value === 'active' })} className="admin-input"><option value="active">Active</option><option value="scheduled">Scheduled</option><option value="paused">Paused</option><option value="draft">Draft</option><option value="expired">Expired</option></select></Field>
            <Field label="Allowed Product IDs"><input value={draft.allowedProductIds} onChange={(e) => setDraft({ ...draft, allowedProductIds: e.target.value })} className="admin-input" placeholder="optional comma-separated ids" /></Field>
            <Field label="Excluded Product IDs"><input value={draft.excludedProductIds} onChange={(e) => setDraft({ ...draft, excludedProductIds: e.target.value })} className="admin-input" placeholder="optional comma-separated ids" /></Field>
            <Field label="Allowed Categories"><input value={draft.allowedCategories} onChange={(e) => setDraft({ ...draft, allowedCategories: e.target.value })} className="admin-input" placeholder="men, women" /></Field>
            <Field label="Excluded Categories"><input value={draft.excludedCategories} onChange={(e) => setDraft({ ...draft, excludedCategories: e.target.value })} className="admin-input" placeholder="men, women" /></Field>
            <Field label="Allowed Collections"><input value={draft.allowedCollections} onChange={(e) => setDraft({ ...draft, allowedCollections: e.target.value })} className="admin-input" placeholder="core, summer" /></Field>
            <Field label="Excluded Collections"><input value={draft.excludedCollections} onChange={(e) => setDraft({ ...draft, excludedCollections: e.target.value })} className="admin-input" placeholder="core, summer" /></Field>
            <Field label="Description"><input value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="admin-input" /></Field>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-[#b8b0a3]"><input type="checkbox" checked={draft.firstOrderOnly} onChange={(e) => setDraft({ ...draft, firstOrderOnly: e.target.checked })} /> First order only</label>
            <button onClick={saveCoupon} disabled={isSaving} className="nexora-button-primary disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Coupon'}</button>
          </div>
        </div>
      )}

      <div className="bg-[#0b0b0d] border border-[#17171a] overflow-x-auto">
        <table className="w-full text-left min-w-[980px]">
          <thead><tr className="border-b border-[#17171a]"><Th>Code</Th><Th>Type</Th><Th>Value</Th><Th>Min</Th><Th>Uses</Th><Th>Dates</Th><Th>Status</Th><Th>Actions</Th></tr></thead>
          <tbody>
            {isLoading ? <tr><td colSpan={8} className="p-8 text-center text-xs text-[#8a8175]">Loading coupons...</td></tr> : filtered.length ? filtered.map((coupon) => (
              <tr key={coupon.id} className="border-b border-[#17171a]/50">
                <td className="p-4"><span className="flex items-center gap-2 text-xs font-bold text-[#c8a96a]"><Tag className="w-3 h-3" />{coupon.code}</span><p className="text-[10px] text-[#8a8175] mt-1">{coupon.title}</p></td>
                <td className="p-4 text-xs text-[#b8b0a3] uppercase">{coupon.type}</td>
                <td className="p-4 text-xs text-[#f4f0e8]">{coupon.type === 'percentage' ? `${coupon.value}%` : coupon.type === 'fixed' ? formatPrice(coupon.value) : 'Free shipping'}</td>
                <td className="p-4 text-xs text-[#b8b0a3]">{coupon.minOrderAmount ? formatPrice(coupon.minOrderAmount) : 'None'}</td>
                <td className="p-4 text-xs text-[#b8b0a3]">{coupon.usedCount || 0} / {coupon.usageLimit || '∞'}</td>
                <td className="p-4 text-[10px] text-[#b8b0a3]">{formatTimestamp(coupon.startDate)} — {formatTimestamp(coupon.endDate)}</td>
                <td className="p-4"><button onClick={() => toggleActive(coupon)} className={`text-[10px] px-2.5 py-1 uppercase tracking-wider border ${coupon.isActive ? 'border-green-400/30 text-green-400' : 'border-red-400/30 text-red-400'}`}>{coupon.isActive ? 'Active' : 'Paused'}</button></td>
                <td className="p-4"><div className="flex gap-2"><button onClick={() => openEdit(coupon)} className="p-1.5 text-[#8a8175] hover:text-[#c8a96a]"><Edit className="w-3.5 h-3.5" /></button><button onClick={() => removeCoupon(coupon)} className="p-1.5 text-[#8a8175] hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
              </tr>
            )) : <tr><td colSpan={8} className="p-8 text-center text-xs text-[#8a8175]">No coupons yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1 block">{label}</label>{children}</div>;
}
function Th({ children }: { children: React.ReactNode }) { return <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">{children}</th>; }
