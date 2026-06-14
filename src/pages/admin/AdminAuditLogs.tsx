import { useEffect, useMemo, useState } from 'react';
import { Search, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import type { AuditLog } from '@/types';

function formatDate(value: unknown) {
  if (!value) return '—';
  const date = value instanceof Date ? value : typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function' ? (value as { toDate: () => Date }).toDate() : new Date(value as string);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString();
}

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const { getAuditLogs } = await import('@/lib/supabase/db');
        const data = await getAuditLogs();
        if (mounted) setLogs(data);
      } catch {
        toast.error('Could not load audit logs');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return logs;
    return logs.filter((log) => [log.action, log.entityType, log.entityId, log.adminEmail].filter(Boolean).join(' ').toLowerCase().includes(term));
  }, [logs, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#c8a96a]">Security</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#f4f0e8]">Audit Logs</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#b8b0a3]">Track important admin actions across products, orders, coupons, promotions, limited drops, and settings.</p>
        </div>
        <div className="flex items-center gap-2 border border-[#2a2a2d] bg-[#0b0b0d] px-3 py-2">
          <Search className="h-4 w-4 text-[#8a8175]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search logs"
            className="bg-transparent text-sm text-[#f4f0e8] outline-none placeholder:text-[#8a8175]"
          />
        </div>
      </div>

      <div className="overflow-hidden border border-[#202024] bg-[#0b0b0d]">
        <div className="flex items-center gap-3 border-b border-[#202024] px-5 py-4">
          <ShieldCheck className="h-5 w-5 text-[#c8a96a]" />
          <span className="text-sm uppercase tracking-[0.2em] text-[#f4f0e8]">Latest activity</span>
        </div>
        {isLoading ? (
          <div className="p-8 text-sm text-[#b8b0a3]">Loading audit trail...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-sm text-[#b8b0a3]">No audit logs found.</div>
        ) : (
          <div className="divide-y divide-[#202024]">
            {filtered.map((log) => (
              <div key={log.id} className="grid gap-3 p-5 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:items-center">
                <div>
                  <p className="text-sm font-medium text-[#f4f0e8]">{log.action}</p>
                  <p className="mt-1 text-xs text-[#8a8175]">{log.entityType} / {log.entityId}</p>
                </div>
                <div className="text-xs text-[#b8b0a3]">{log.adminEmail || log.adminId || 'System'}</div>
                <div className="text-xs text-[#b8b0a3]">{formatDate(log.createdAt)}</div>
                <details className="text-xs text-[#8a8175]">
                  <summary className="cursor-pointer text-[#c8a96a]">Details</summary>
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap bg-[#050505] p-3 text-[11px] text-[#b8b0a3]">{JSON.stringify({ before: log.before, after: log.after }, null, 2)}</pre>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
