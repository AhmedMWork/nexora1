// ============================================================
// NEXORA — Admin Promotions Page
// Storewide offers, scheduled campaigns, banners, countdowns
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { BadgePercent, Edit, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { DiscountType, Promotion } from '@/types';
import { formatTimestamp } from '@/lib/utils';

type Draft = {
  title: string;
  subtitle: string;
  type: Promotion['type'];
  discountType: DiscountType;
  discountValue: number;
  targetIds: string;
  status: Promotion['status'];
  startDate: string;
  endDate: string;
  bannerText: string;
  showOnHome: boolean;
  showOnProduct: boolean;
  showOnCart: boolean;
  showCountdown: boolean;
};

const emptyDraft: Draft = {
  title: '', subtitle: '', type: 'storewide', discountType: 'percentage', discountValue: 10, targetIds: '', status: 'active',
  startDate: new Date().toISOString().slice(0, 10), endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  bannerText: '', showOnHome: true, showOnProduct: true, showOnCart: true, showCountdown: true,
};

function toInputDate(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  return new Date(value as string | number).toISOString().slice(0, 10);
}

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadPromotions = async () => {
    setIsLoading(true);
    try { const { getPromotions } = await import('@/lib/supabase/db'); setPromotions(await getPromotions()); }
    catch { toast.error('Could not load promotions'); }
    finally { setIsLoading(false); }
  };
  useEffect(() => { loadPromotions(); }, []);

  const filtered = useMemo(() => promotions.filter((p) => !query || p.title.toLowerCase().includes(query.toLowerCase())), [promotions, query]);

  const openCreate = () => { setEditing(null); setDraft(emptyDraft); setShowForm(true); };
  const openEdit = (p: Promotion) => {
    setEditing(p);
    setDraft({
      title: p.title, subtitle: p.subtitle || '', type: p.type, discountType: p.discountType, discountValue: p.discountValue,
      targetIds: p.targetIds?.join(', ') || '', status: p.status, startDate: toInputDate(p.startDate), endDate: toInputDate(p.endDate),
      bannerText: p.bannerText || '', showOnHome: p.showOnHome, showOnProduct: p.showOnProduct, showOnCart: p.showOnCart, showCountdown: p.showCountdown,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!draft.title.trim()) return toast.error('Promotion title is required');
    try {
      const payload = {
        title: draft.title.trim(), subtitle: draft.subtitle.trim(), type: draft.type, discountType: draft.discountType, discountValue: Number(draft.discountValue),
        targetIds: draft.targetIds.split(',').map((v) => v.trim()).filter(Boolean), status: draft.status,
        startDate: new Date(draft.startDate), endDate: new Date(draft.endDate), bannerText: draft.bannerText.trim(),
        showOnHome: draft.showOnHome, showOnProduct: draft.showOnProduct, showOnCart: draft.showOnCart, showCountdown: draft.showCountdown,
      };
      const { createPromotion, updatePromotion } = await import('@/lib/supabase/db');
      if (editing) await updatePromotion(editing.id, payload); else await createPromotion(payload);
      toast.success(editing ? 'Promotion updated' : 'Promotion created');
      setShowForm(false); await loadPromotions();
    } catch { toast.error('Could not save promotion'); }
  };

  const remove = async (p: Promotion) => {
    if (!window.confirm(`Delete promotion ${p.title}?`)) return;
    try { const { deletePromotion } = await import('@/lib/supabase/db'); await deletePromotion(p.id); toast.success('Promotion deleted'); await loadPromotions(); }
    catch { toast.error('Could not delete promotion'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div><h1 className="text-lg font-bold tracking-wider uppercase text-[#f4f0e8]">Promotions</h1><p className="text-xs text-[#8a8175] mt-1">Create premium banners, timed offers, and automatic campaign rules</p></div>
        <div className="flex flex-col sm:flex-row gap-2"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search promotions..." className="admin-input" /><button onClick={loadPromotions} className="nexora-button flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />Refresh</button><button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#c8a96a] text-[#050505] text-xs font-bold tracking-wider uppercase"><Plus className="w-3.5 h-3.5" />New Offer</button></div>
      </div>
      {showForm && <div className="p-5 bg-[#0b0b0d] border border-[#17171a]"><div className="flex items-center justify-between mb-5"><h3 className="text-sm font-bold text-[#f4f0e8]">{editing ? 'Edit Promotion' : 'New Promotion'}</h3><button onClick={() => setShowForm(false)} className="text-[#8a8175] hover:text-[#f4f0e8]"><X className="w-4 h-4" /></button></div><div className="grid md:grid-cols-4 gap-4"><Field label="Title"><input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="admin-input" /></Field><Field label="Subtitle"><input value={draft.subtitle} onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })} className="admin-input" /></Field><Field label="Campaign Type"><select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as Promotion['type'] })} className="admin-input"><option value="storewide">Storewide</option><option value="category">Category</option><option value="collection">Collection</option><option value="drop">Drop</option><option value="product">Product</option><option value="free_shipping">Free Shipping</option></select></Field><Field label="Discount Type"><select value={draft.discountType} onChange={(e) => setDraft({ ...draft, discountType: e.target.value as DiscountType })} className="admin-input"><option value="percentage">Percentage</option><option value="fixed">Fixed</option><option value="free_shipping">Free Shipping</option></select></Field><Field label="Discount Value"><input type="number" value={draft.discountValue} onChange={(e) => setDraft({ ...draft, discountValue: Number(e.target.value) })} className="admin-input" /></Field><Field label="Target IDs"><input value={draft.targetIds} onChange={(e) => setDraft({ ...draft, targetIds: e.target.value })} className="admin-input" placeholder="comma-separated" /></Field><Field label="Start"><input type="date" value={draft.startDate} onChange={(e) => setDraft({ ...draft, startDate: e.target.value })} className="admin-input" /></Field><Field label="End"><input type="date" value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} className="admin-input" /></Field><Field label="Status"><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Promotion['status'] })} className="admin-input"><option value="active">Active</option><option value="scheduled">Scheduled</option><option value="paused">Paused</option><option value="draft">Draft</option><option value="ended">Ended</option><option value="archived">Archived</option></select></Field><Field label="Banner Text"><input value={draft.bannerText} onChange={(e) => setDraft({ ...draft, bannerText: e.target.value })} className="admin-input" /></Field></div><div className="mt-5 flex flex-wrap gap-5 text-xs text-[#b8b0a3]"><label><input type="checkbox" checked={draft.showOnHome} onChange={(e) => setDraft({ ...draft, showOnHome: e.target.checked })} /> Home</label><label><input type="checkbox" checked={draft.showOnProduct} onChange={(e) => setDraft({ ...draft, showOnProduct: e.target.checked })} /> Product</label><label><input type="checkbox" checked={draft.showOnCart} onChange={(e) => setDraft({ ...draft, showOnCart: e.target.checked })} /> Cart</label><label><input type="checkbox" checked={draft.showCountdown} onChange={(e) => setDraft({ ...draft, showCountdown: e.target.checked })} /> Countdown</label><button onClick={save} className="nexora-button-primary">Save Promotion</button></div></div>}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">{isLoading ? <p className="text-xs text-[#8a8175]">Loading promotions...</p> : filtered.length ? filtered.map((p) => <div key={p.id} className="p-5 bg-[#0b0b0d] border border-[#17171a]"><div className="flex justify-between gap-3"><div><div className="flex items-center gap-2 text-[#c8a96a]"><BadgePercent className="w-4 h-4" /><h3 className="text-sm font-bold uppercase tracking-wider">{p.title}</h3></div><p className="text-xs text-[#8a8175] mt-1">{p.subtitle || p.bannerText}</p></div><span className="text-[10px] uppercase border border-[#2a2a2d] px-2 py-1 h-fit text-[#b8b0a3]">{p.status}</span></div><div className="grid grid-cols-2 gap-2 text-xs mt-4 text-[#b8b0a3]"><span>Type: {p.type}</span><span>Discount: {p.discountType === 'percentage' ? `${p.discountValue}%` : p.discountValue}</span><span>Start: {formatTimestamp(p.startDate)}</span><span>End: {formatTimestamp(p.endDate)}</span></div><div className="flex gap-2 mt-5"><button onClick={() => openEdit(p)} className="nexora-button flex items-center gap-2"><Edit className="w-3.5 h-3.5" />Edit</button><button onClick={() => remove(p)} className="nexora-button text-red-400 flex items-center gap-2"><Trash2 className="w-3.5 h-3.5" />Delete</button></div></div>) : <p className="text-xs text-[#8a8175]">No promotions yet</p>}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div><label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1 block">{label}</label>{children}</div>; }
