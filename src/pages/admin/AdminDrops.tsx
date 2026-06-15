import { useEffect, useMemo, useState } from 'react';
import { CalendarClock, Edit, Plus, RefreshCw, Trash2, X, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Drop } from '@/types';
import { formatTimestamp, generateSlug } from '@/lib/utils';

type Draft = {
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  status: Drop['status'];
  launchDate: string;
  endDate: string;
  productIds: string;
  isLimited: boolean;
  showCountdown: boolean;
  seoTitle: string;
  seoDescription: string;
};

const emptyDraft: Draft = {
  name: '',
  slug: '',
  description: '',
  heroImage: '/assets/hero-model.jpg',
  status: 'draft',
  launchDate: new Date().toISOString().slice(0, 10),
  endDate: '',
  productIds: '',
  isLimited: true,
  showCountdown: true,
  seoTitle: '',
  seoDescription: '',
};

function toInputDate(value: unknown): string {
  if (!value) return '';
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function Field({ label, help, children }: { label: string; help: string; children: React.ReactNode }) {
  return <div className="studio-field"><label>{label}</label>{children}<p className="studio-help">{help}</p></div>;
}

const statusHelp = [
  ['Draft', 'Not visible to customers. Use while preparing images and product list.'],
  ['Scheduled', 'Prepared for a future date. Keep it hidden until you switch to Live.'],
  ['Live', 'Visible in Limited page. Products connected to it can be promoted as limited.'],
  ['Ended', 'No longer sold as a limited release. Keep for internal reference.'],
  ['Archived', 'Hidden old release.'],
];

export default function AdminDrops() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editing, setEditing] = useState<Drop | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadDrops = async () => {
    setIsLoading(true);
    try {
      const { getDrops } = await import('@/lib/supabase/db');
      setDrops(await getDrops());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not load limited drops');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadDrops(); }, []);

  const filtered = useMemo(() => drops.filter((d) => !query || d.name.toLowerCase().includes(query.toLowerCase())), [drops, query]);

  const openCreate = () => { setEditing(null); setDraft(emptyDraft); setShowForm(true); };
  const openEdit = (d: Drop) => {
    setEditing(d);
    setDraft({
      name: d.name,
      slug: d.slug,
      description: d.description,
      heroImage: d.heroImage,
      status: d.status,
      launchDate: toInputDate(d.launchDate),
      endDate: toInputDate(d.endDate),
      productIds: d.productIds?.join(', ') || '',
      isLimited: d.isLimited,
      showCountdown: d.showCountdown,
      seoTitle: d.seoTitle || '',
      seoDescription: d.seoDescription || '',
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!draft.name.trim()) return toast.error('Limited drop name is required');
    try {
      const payload = {
        name: draft.name.trim(),
        slug: draft.slug || generateSlug(draft.name),
        description: draft.description.trim(),
        heroImage: draft.heroImage,
        status: draft.status,
        launchDate: new Date(draft.launchDate),
        endDate: draft.endDate ? new Date(draft.endDate) : undefined,
        productIds: draft.productIds.split(',').map((v) => v.trim()).filter(Boolean),
        isLimited: draft.isLimited,
        showCountdown: draft.showCountdown,
        seoTitle: draft.seoTitle || `${draft.name} | NEXORA`,
        seoDescription: draft.seoDescription || draft.description.slice(0, 155),
      };
      const { createDrop, updateDrop } = await import('@/lib/supabase/db');
      if (editing) await updateDrop(editing.id, payload);
      else await createDrop(payload);
      toast.success(editing ? 'Limited drop updated' : 'Limited drop created');
      setShowForm(false);
      await loadDrops();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save limited drop');
    }
  };

  const remove = async (d: Drop) => {
    if (!window.confirm(`Delete drop ${d.name}?`)) return;
    try {
      const { deleteDrop } = await import('@/lib/supabase/db');
      await deleteDrop(d.id);
      toast.success('Drop deleted');
      await loadDrops();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not delete limited drop');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#FFF0E1]">Limited Drops</h1>
          <p className="mt-1 text-sm text-[#BCAEA0]">A drop is a limited release, not a coupon. Use it to launch selected products for a specific period.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search limited drops..." className="studio-input" />
          <button onClick={loadDrops} className="nexora-button"><RefreshCw className="h-4 w-4" />Refresh</button>
          <button onClick={openCreate} className="nexora-button-primary"><Plus className="h-4 w-4" />New Drop</button>
        </div>
      </div>

      <div className="studio-card p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#FFF0E1]"><HelpCircle className="h-4 w-4 text-[#D7B98E]" />How to use Limited Drops</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <p className="rounded-2xl border border-[#2E3442] bg-[#12151B] p-4 text-xs leading-6 text-[#BCAEA0]"><b className="text-[#F5F1EA]">Coupons</b> are discount codes. They reduce price.</p>
          <p className="rounded-2xl border border-[#2E3442] bg-[#12151B] p-4 text-xs leading-6 text-[#BCAEA0]"><b className="text-[#F5F1EA]">Limited Drops</b> are selected products released for a limited time.</p>
          <p className="rounded-2xl border border-[#2E3442] bg-[#12151B] p-4 text-xs leading-6 text-[#BCAEA0]"><b className="text-[#F5F1EA]">Product IDs</b> are copied from the Products table. Separate multiple IDs with commas.</p>
        </div>
      </div>

      {showForm && (
        <div className="studio-card p-5 sm:p-7">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#FFF0E1]">{editing ? 'Edit Limited Drop' : 'Create Limited Drop'}</h3>
            <button onClick={() => setShowForm(false)} className="text-[#A7AEBB] hover:text-[#F5F1EA]"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            <Field label="Drop name" help="Customer-facing release name. Example: Midnight Essentials."><input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value, slug: draft.slug || generateSlug(e.target.value) })} className="studio-input" /></Field>
            <Field label="Slug" help="Used in URLs and SEO. Leave as generated unless needed."><input value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} className="studio-input" /></Field>
            <Field label="Status" help="Live is visible. Draft/Scheduled/Ended/Archived are not for normal buying."><select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Drop['status'] })} className="studio-input"><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="live">Live</option><option value="ended">Ended</option><option value="archived">Archived</option></select></Field>
            <Field label="Start date" help="When the release should start. Use Live status when ready to publish."><input type="date" value={draft.launchDate} onChange={(e) => setDraft({ ...draft, launchDate: e.target.value })} className="studio-input" /></Field>
            <Field label="End date" help="Optional. Used for countdown and internal planning."><input type="date" value={draft.endDate} onChange={(e) => setDraft({ ...draft, endDate: e.target.value })} className="studio-input" /></Field>
            <Field label="Hero image" help="Banner image URL for the drop page/card."><input value={draft.heroImage} onChange={(e) => setDraft({ ...draft, heroImage: e.target.value })} className="studio-input" /></Field>
            <div className="md:col-span-3"><Field label="Product IDs" help="Paste product IDs from Products. Example: id1, id2, id3."><input value={draft.productIds} onChange={(e) => setDraft({ ...draft, productIds: e.target.value })} className="studio-input" /></Field></div>
            <div className="md:col-span-3"><Field label="Description" help="Short clear explanation of this release for customers."><textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="studio-input min-h-28" /></Field></div>
            <Field label="SEO title" help="Optional search title. Auto-created if empty."><input value={draft.seoTitle} onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })} className="studio-input" /></Field>
            <Field label="SEO description" help="Optional Google description up to about 155 characters."><input value={draft.seoDescription} onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })} className="studio-input" /></Field>
            <div className="flex items-center gap-4 text-sm text-[#BCAEA0]"><label className="flex items-center gap-2"><input type="checkbox" checked={draft.isLimited} onChange={(e) => setDraft({ ...draft, isLimited: e.target.checked })} />Limited</label><label className="flex items-center gap-2"><input type="checkbox" checked={draft.showCountdown} onChange={(e) => setDraft({ ...draft, showCountdown: e.target.checked })} />Countdown</label></div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3"><button onClick={() => setShowForm(false)} className="nexora-button">Cancel</button><button onClick={save} className="nexora-button-primary">Save Limited Drop</button></div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {isLoading ? <p className="text-sm text-[#BCAEA0]">Loading drops...</p> : filtered.length ? filtered.map((d) => (
          <div key={d.id} className="studio-card overflow-hidden">
            <img src={d.heroImage || '/assets/hero-model.jpg'} alt={d.name} className="h-40 w-full object-cover bg-[#12151B]" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-3"><div><h3 className="flex items-center gap-2 text-sm font-semibold text-[#FFF0E1]"><CalendarClock className="h-4 w-4 text-[#D7B98E]" />{d.name}</h3><p className="mt-2 line-clamp-2 text-xs leading-6 text-[#BCAEA0]">{d.description || 'No description added yet.'}</p></div><span className="rounded-full border border-[#2E3442] px-3 py-1 text-[10px] uppercase text-[#D7B98E]">{d.status}</span></div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-[#BCAEA0]"><span>Start: {formatTimestamp(d.launchDate)}</span><span>Products: {d.productIds?.length || 0}</span><span>{d.isLimited ? 'Limited release' : 'Open release'}</span><span>{d.showCountdown ? 'Countdown on' : 'No countdown'}</span></div>
              <div className="mt-5 flex gap-2"><button onClick={() => openEdit(d)} className="nexora-button"><Edit className="h-4 w-4" />Edit</button><button onClick={() => remove(d)} className="nexora-button text-red-300"><Trash2 className="h-4 w-4" />Delete</button></div>
            </div>
          </div>
        )) : <div className="studio-card p-8 text-center text-sm text-[#BCAEA0]">No limited drops yet. Create one when you have a real limited release.</div>}
      </div>

      <div className="studio-card p-5">
        <h2 className="mb-3 text-sm font-semibold text-[#FFF0E1]">Status guide</h2>
        <div className="grid gap-2 md:grid-cols-5">{statusHelp.map(([name, help]) => <div key={name} className="rounded-2xl border border-[#2E3442] bg-[#12151B] p-3"><p className="text-xs font-semibold text-[#D7B98E]">{name}</p><p className="mt-1 text-[11px] leading-5 text-[#A7AEBB]">{help}</p></div>)}</div>
      </div>
    </div>
  );
}
