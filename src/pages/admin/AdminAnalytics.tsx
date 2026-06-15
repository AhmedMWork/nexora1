import { useEffect, useMemo, useState } from 'react';
import { BarChart3, RefreshCw, ShoppingCart, Users, MousePointerClick, PackageMinus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type AnalyticsEvent = {
  id?: string;
  event_name: string;
  session_id?: string;
  path?: string;
  language?: string;
  device?: string;
  payload?: Record<string, unknown>;
  created_at?: string;
};

type OrderRow = { total?: number; order_status?: string; created_at?: string };

type AnalyticsData = {
  events: AnalyticsEvent[];
  orders: OrderRow[];
};

function Card({ title, value, helper, icon: Icon }: { title: string; value: string; helper: string; icon: React.ElementType }) {
  return <div className="studio-card p-5"><div className="mb-3 flex items-center justify-between"><Icon className="h-5 w-5 text-[#D2B48C]" /><span className="text-[10px] uppercase tracking-[0.18em] text-[#BCAEA0]">{title}</span></div><p className="text-2xl font-bold text-[#FFF0E1]">{value}</p><p className="mt-2 text-xs leading-6 text-[#BCAEA0]">{helper}</p></div>;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData>({ events: [], orders: [] });
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const { getAnalyticsSummary } = await import('@/lib/supabase/db');
      setData(await getAnalyticsSummary());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const stats = useMemo(() => {
    const sessions = new Set(data.events.map((e) => e.session_id).filter(Boolean));
    const count = (name: string) => data.events.filter((e) => e.event_name === name).length;
    const productViews = count('product_view');
    const addToCart = count('add_to_cart');
    const removeFromCart = count('remove_from_cart');
    const cartViews = count('cart_view');
    const checkoutStart = count('checkout_start');
    const orderSuccess = count('order_success') + data.orders.length;
    const abandonedCart = Math.max(0, cartViews - orderSuccess);
    const abandonedCheckout = Math.max(0, checkoutStart - orderSuccess);
    const revenue = data.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const productMap = new Map<string, number>();
    data.events.filter((e) => ['product_view','add_to_cart','remove_from_cart'].includes(e.event_name)).forEach((event) => {
      const name = String(event.payload?.productName || event.payload?.name || event.payload?.productId || 'Unknown product');
      productMap.set(name, (productMap.get(name) || 0) + 1);
    });
    return { sessions: sessions.size, productViews, addToCart, removeFromCart, cartViews, checkoutStart, orderSuccess, abandonedCart, abandonedCheckout, revenue, topProducts: [...productMap.entries()].sort((a,b) => b[1]-a[1]).slice(0, 8) };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#FFF0E1]">Analytics</h1>
          <p className="mt-1 text-sm text-[#BCAEA0]">Understand visits, cart abandonment, checkout drop-off, and product interest.</p>
        </div>
        <button onClick={load} className="nexora-button"><RefreshCw className="h-4 w-4" />Refresh</button>
      </div>

      {isLoading && <div className="studio-card p-6 text-sm text-[#BCAEA0]">Loading analytics...</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card title="Visitors" value={String(stats.sessions)} helper="Unique browser sessions tracked by storefront events." icon={Users} />
        <Card title="Cart Adds" value={String(stats.addToCart)} helper={`${stats.removeFromCart} remove-from-cart events captured.`} icon={ShoppingCart} />
        <Card title="Cart Abandon" value={String(stats.abandonedCart)} helper="Cart views without matching successful orders." icon={PackageMinus} />
        <Card title="Revenue" value={formatPrice(stats.revenue)} helper={`${stats.orderSuccess} successful order signals.`} icon={BarChart3} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="studio-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-[#FFF0E1]">Conversion Funnel</h2>
          <p className="mt-1 text-xs text-[#BCAEA0]">Shows where customers stop before ordering.</p>
          <div className="mt-5 space-y-3">
            {[
              ['Product views', stats.productViews],
              ['Add to cart', stats.addToCart],
              ['Cart views', stats.cartViews],
              ['Checkout started', stats.checkoutStart],
              ['Orders completed', stats.orderSuccess],
            ].map(([label, value]) => {
              const width = Math.max(4, Math.min(100, Number(value) / Math.max(1, stats.productViews) * 100));
              return <div key={String(label)}><div className="mb-1 flex justify-between text-xs"><span className="text-[#D2C0B0]">{label}</span><span className="text-[#D2B48C]">{value}</span></div><div className="h-2 rounded-full bg-[#0E0B0A]"><div className="h-full rounded-full bg-[#D2B48C]" style={{ width: `${width}%` }} /></div></div>;
            })}
          </div>
        </div>

        <div className="studio-card p-5">
          <h2 className="text-sm font-semibold text-[#FFF0E1]">Drop-off</h2>
          <div className="mt-5 space-y-4">
            <div><p className="text-2xl font-bold text-[#FFF0E1]">{stats.abandonedCart}</p><p className="text-xs text-[#BCAEA0]">Reached cart but did not order.</p></div>
            <div><p className="text-2xl font-bold text-[#FFF0E1]">{stats.abandonedCheckout}</p><p className="text-xs text-[#BCAEA0]">Started checkout but did not order.</p></div>
          </div>
        </div>
      </div>

      <div className="studio-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#FFF0E1]"><MousePointerClick className="h-4 w-4 text-[#D2B48C]" />Product Interest</h2>
        <div className="space-y-2">
          {stats.topProducts.length ? stats.topProducts.map(([name, count]) => <div key={name} className="flex justify-between rounded-2xl border border-[#332923] bg-[#17110F] px-4 py-3 text-sm"><span className="text-[#D2C0B0]">{name}</span><span className="font-semibold text-[#D2B48C]">{count}</span></div>) : <p className="text-sm text-[#BCAEA0]">No product interaction data yet. Events will appear after customers browse the live site.</p>}
        </div>
      </div>
    </div>
  );
}
