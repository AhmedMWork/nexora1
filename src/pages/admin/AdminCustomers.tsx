import { useEffect, useMemo, useState } from 'react';
import { RefreshCw, Search, Users, ShoppingBag, MapPin, Phone, Mail, Clock, AlertTriangle } from 'lucide-react';
import { formatPrice, formatTimestamp } from '@/lib/utils';
import type { Order } from '@/types';

type CustomerRow = {
  key: string;
  name: string;
  phone: string;
  email?: string;
  governorate: string;
  city: string;
  address: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: Date;
  lastOrderNumber: string;
  lastStatus: string;
  products: string[];
};

function Metric({ label, value, helper, icon: Icon }: { label: string; value: string; helper: string; icon: React.ElementType }) {
  return (
    <div className="studio-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <Icon className="h-5 w-5 text-[#D2B48C]" />
        <span className="text-[10px] uppercase tracking-[0.18em] text-[#BCAEA0]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#FFF0E1]">{value}</p>
      <p className="mt-2 text-xs leading-6 text-[#BCAEA0]">{helper}</p>
    </div>
  );
}

export default function AdminCustomers() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const { getOrders } = await import('@/lib/supabase/db');
      setOrders(await getOrders());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const customers = useMemo<CustomerRow[]>(() => {
    const map = new Map<string, CustomerRow>();
    for (const order of orders) {
      const key = order.customer.phone || order.customer.email || order.customer.fullName || order.id;
      const existing = map.get(key);
      const productNames = order.items.map((item) => item.name).filter(Boolean);
      if (!existing) {
        map.set(key, {
          key,
          name: order.customer.fullName || 'Unknown customer',
          phone: order.customer.phone || '',
          email: order.customer.email,
          governorate: order.customer.governorate || '',
          city: order.customer.city || '',
          address: order.customer.address || '',
          orderCount: 1,
          totalSpent: Number(order.total || 0),
          lastOrderAt: order.createdAt,
          lastOrderNumber: order.orderNumber,
          lastStatus: order.status,
          products: productNames,
        });
      } else {
        existing.orderCount += 1;
        existing.totalSpent += Number(order.total || 0);
        existing.products = [...new Set([...existing.products, ...productNames])];
        if (order.createdAt > existing.lastOrderAt) {
          existing.lastOrderAt = order.createdAt;
          existing.lastOrderNumber = order.orderNumber;
          existing.lastStatus = order.status;
          existing.governorate = order.customer.governorate || existing.governorate;
          existing.city = order.customer.city || existing.city;
          existing.address = order.customer.address || existing.address;
        }
      }
    }
    return [...map.values()].sort((a, b) => b.lastOrderAt.getTime() - a.lastOrderAt.getTime());
  }, [orders]);

  const filteredCustomers = customers.filter((customer) => {
    const text = `${customer.name} ${customer.phone} ${customer.email || ''} ${customer.governorate} ${customer.city}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const totalSpent = customers.reduce((sum, customer) => sum + customer.totalSpent, 0);
  const repeatCustomers = customers.filter((customer) => customer.orderCount > 1).length;
  const topGovernorate = Object.entries(customers.reduce<Record<string, number>>((acc, customer) => {
    if (customer.governorate) acc[customer.governorate] = (acc[customer.governorate] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1])[0]?.[0] || 'No data yet';

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#FFF0E1]">Customers</h1>
          <p className="mt-1 text-sm text-[#BCAEA0]">Customer intelligence built from orders: contact data, location, order value, and repeat purchase signals.</p>
        </div>
        <button onClick={load} className="nexora-button"><RefreshCw className="h-4 w-4" />Refresh</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Customers" value={String(customers.length)} helper="Unique phone/email identities from orders." icon={Users} />
        <Metric label="Customer Revenue" value={formatPrice(totalSpent)} helper="Total COD order value linked to customers." icon={ShoppingBag} />
        <Metric label="Repeat Buyers" value={String(repeatCustomers)} helper="Customers with more than one order." icon={Clock} />
        <Metric label="Top Area" value={topGovernorate} helper="Most common governorate in orders." icon={MapPin} />
      </div>

      <div className="studio-card p-4">
        <label className="flex items-center gap-3 rounded-2xl border border-[#332923] bg-[#0E0B0A] px-4 py-3">
          <Search className="h-4 w-4 text-[#D2B48C]" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, phone, email, governorate, or city" className="w-full bg-transparent text-sm text-[#FFF0E1] outline-none placeholder:text-[#8A7A72]" />
        </label>
      </div>

      {isLoading ? (
        <div className="studio-card p-8 text-center text-sm text-[#BCAEA0]">Loading customers...</div>
      ) : filteredCustomers.length ? (
        <div className="grid gap-4">
          {filteredCustomers.map((customer) => (
            <article key={customer.key} className="studio-card p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#FFF0E1]">{customer.name}</h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-[#BCAEA0]">
                    {customer.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{customer.phone}</span>}
                    {customer.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{customer.email}</span>}
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{[customer.governorate, customer.city].filter(Boolean).join(' / ') || 'No location'}</span>
                  </div>
                  {customer.address && <p className="mt-3 text-xs leading-6 text-[#BCAEA0]">{customer.address}</p>}
                </div>
                <div className="grid min-w-[280px] grid-cols-2 gap-2 text-xs">
                  <div className="rounded-2xl border border-[#332923] bg-[#17110F] p-3"><p className="text-[#BCAEA0]">Orders</p><p className="mt-1 text-lg font-bold text-[#FFF0E1]">{customer.orderCount}</p></div>
                  <div className="rounded-2xl border border-[#332923] bg-[#17110F] p-3"><p className="text-[#BCAEA0]">Spent</p><p className="mt-1 text-lg font-bold text-[#D2B48C]">{formatPrice(customer.totalSpent)}</p></div>
                </div>
              </div>
              <div className="mt-5 grid gap-3 border-t border-[#332923] pt-4 text-xs text-[#BCAEA0] sm:grid-cols-3">
                <p><span className="text-[#FFF0E1]">Last order:</span> {customer.lastOrderNumber}</p>
                <p><span className="text-[#FFF0E1]">Last status:</span> {customer.lastStatus}</p>
                <p><span className="text-[#FFF0E1]">Last activity:</span> {formatTimestamp(customer.lastOrderAt)}</p>
              </div>
              {customer.products.length > 0 && <p className="mt-3 text-xs leading-6 text-[#BCAEA0]"><span className="text-[#FFF0E1]">Products:</span> {customer.products.slice(0, 6).join(', ')}</p>}
            </article>
          ))}
        </div>
      ) : (
        <div className="studio-card p-8 text-center text-sm text-[#BCAEA0]"><AlertTriangle className="mx-auto mb-3 h-5 w-5 text-[#D2B48C]" />No customers found yet. Customers appear after orders are created.</div>
      )}
    </div>
  );
}
