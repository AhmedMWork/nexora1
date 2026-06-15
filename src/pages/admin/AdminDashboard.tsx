import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, Package, SearchCheck, ShieldCheck, ShoppingBag, TrendingDown, TrendingUp, Users, Warehouse } from 'lucide-react';
import { formatPrice, formatTimestamp, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Coupon, Drop, Order, Product } from '@/types';

type DashboardData = {
  orders: Order[];
  products: Product[];
  coupons: Coupon[];
  drops: Drop[];
  analytics: { events: Array<{ event_name: string; session_id?: string; payload?: Record<string, unknown> }>; orders: Array<{ total?: number }> };
};

function Card({ label, value, helper, icon: Icon, tone = 'default' }: { label: string; value: string; helper: string; icon: React.ElementType; tone?: 'default' | 'warn' | 'good' }) {
  const color = tone === 'warn' ? 'text-amber-300' : tone === 'good' ? 'text-emerald-300' : 'text-[#D2B48C]';
  return (
    <div className="studio-card p-5">
      <div className="mb-3 flex items-center justify-between"><Icon className={`h-5 w-5 ${color}`} /><span className="text-[10px] uppercase tracking-[0.18em] text-[#BCAEA0]">{label}</span></div>
      <p className="text-2xl font-bold text-[#FFF0E1]">{value}</p>
      <p className="mt-2 text-xs leading-6 text-[#BCAEA0]">{helper}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData>({ orders: [], products: [], coupons: [], drops: [], analytics: { events: [], orders: [] } });
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    try {
      const db = await import('@/lib/supabase/db');
      const [orders, products, coupons, drops, analytics] = await Promise.all([
        db.getOrders().catch(() => []),
        db.getAdminProducts().catch(() => []),
        db.getCoupons().catch(() => []),
        db.getDrops().catch(() => []),
        db.getAnalyticsSummary().catch(() => ({ events: [], orders: [] })),
      ]);
      setData({ orders, products, coupons, drops, analytics });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const stats = useMemo(() => {
    const validOrders = data.orders.filter((order) => !['cancelled', 'returned', 'failed'].includes(order.status));
    const revenue = validOrders.reduce((sum, order) => sum + Number(order.total || 0), 0);
    const customers = new Set(data.orders.map((order) => order.customer.phone || order.customer.email).filter(Boolean));
    const lowStock = data.products.filter((product) => product.sizes.some((size) => Number(size.stock) <= Number(size.lowStockThreshold || 3))).length;
    const pendingOrders = data.orders.filter((order) => ['pending', 'confirmed'].includes(order.status)).length;
    const activeCoupons = data.coupons.filter((coupon) => coupon.isActive || coupon.status === 'active').length;
    const liveDrops = data.drops.filter((drop) => drop.status === 'live').length;
    const sessions = new Set(data.analytics.events.map((event) => event.session_id).filter(Boolean)).size;
    const count = (name: string) => data.analytics.events.filter((event) => event.event_name === name).length;
    const productViews = count('product_view');
    const addToCart = count('add_to_cart');
    const checkoutStart = count('checkout_start');
    const orderSignals = count('order_success') + data.orders.length;
    const conversion = productViews ? Math.round((orderSignals / productViews) * 100) : 0;
    const cartDrop = Math.max(0, addToCart - orderSignals);
    return { revenue, customers: customers.size, lowStock, pendingOrders, activeCoupons, liveDrops, sessions, productViews, addToCart, checkoutStart, orderSignals, conversion, cartDrop };
  }, [data]);

  const recentOrders = data.orders.slice(0, 6);
  const quickActions = [
    { label: 'Add Product', desc: 'Create product with price, compare price, colors, sizes, stock, and multiple images.', href: '/nexora-admin/products', icon: Package },
    { label: 'Review Orders', desc: 'Confirm COD orders, update statuses, and open WhatsApp templates.', href: '/nexora-admin/orders', icon: ShoppingBag },
    { label: 'Customers', desc: 'See customer contact data, locations, purchase totals, and last order.', href: '/nexora-admin/customers', icon: Users },
    { label: 'Analytics', desc: 'Track visits, cart adds, checkout starts, orders, and product interest.', href: '/nexora-admin/analytics', icon: BarChart3 },
    { label: 'SEO', desc: 'Check Google files, sitemap, search setup, and product SEO readiness.', href: '/nexora-admin/seo', icon: SearchCheck },
    { label: 'System Health', desc: 'Review Supabase, functions, storage, routes, and deployment steps.', href: '/nexora-admin/system-health', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#FFF0E1]">NEXORA Operations Overview</h1>
          <p className="mt-1 text-sm text-[#BCAEA0]">A launch-ready control center for sales, customers, products, stock, coupons, drops, and conversion signals.</p>
        </div>
        <button onClick={load} className="nexora-button">Refresh</button>
      </div>

      {isLoading && <div className="studio-card p-4 text-sm text-[#BCAEA0]">Loading operation data...</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Revenue" value={formatPrice(stats.revenue)} helper="COD order value excluding cancelled/returned/failed orders." icon={TrendingUp} tone="good" />
        <Card label="Orders" value={String(data.orders.length)} helper={`${stats.pendingOrders} orders need review or confirmation.`} icon={ShoppingBag} tone={stats.pendingOrders ? 'warn' : 'default'} />
        <Card label="Customers" value={String(stats.customers)} helper="Unique customer identities from phone/email in orders." icon={Users} />
        <Card label="Low Stock" value={String(stats.lowStock)} helper="Products with one or more sizes at or below threshold." icon={Warehouse} tone={stats.lowStock ? 'warn' : 'default'} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card label="Visitors" value={String(stats.sessions)} helper="Unique browser sessions from analytics events." icon={Users} />
        <Card label="Cart Adds" value={String(stats.addToCart)} helper={`${stats.cartDrop} cart additions did not become orders yet.`} icon={TrendingDown} tone={stats.cartDrop ? 'warn' : 'default'} />
        <Card label="Conversion" value={`${stats.conversion}%`} helper="Orders compared with product-view signals." icon={BarChart3} />
        <Card label="Campaigns" value={`${stats.activeCoupons}/${stats.liveDrops}`} helper="Active coupons / live limited drops." icon={Package} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="studio-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#332923] p-5">
            <h2 className="text-sm font-semibold text-[#FFF0E1]">Recent Orders</h2>
            <Link to="/nexora-admin/orders" className="flex items-center gap-1 text-xs font-semibold text-[#D2B48C]">View All <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead className="bg-[#17110F]"><tr>{['Order','Customer','Total','Status','Date'].map((h) => <th key={h} className="p-4 text-[10px] uppercase tracking-[0.18em] text-[#BCAEA0]">{h}</th>)}</tr></thead>
              <tbody>
                {recentOrders.length ? recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[#332923]/70">
                    <td className="p-4 text-xs font-semibold text-[#D2B48C]">{order.orderNumber}</td>
                    <td className="p-4 text-xs text-[#FFF0E1]">{order.customer.fullName}<br /><span className="text-[#BCAEA0]">{order.customer.phone}</span></td>
                    <td className="p-4 text-xs text-[#FFF0E1]">{formatPrice(order.total)}</td>
                    <td className="p-4"><span className={`status-badge ${getStatusColor(order.status)} text-[9px]`}>{getStatusLabel(order.status)}</span></td>
                    <td className="p-4 text-xs text-[#BCAEA0]">{formatTimestamp(order.createdAt)}</td>
                  </tr>
                )) : <tr><td colSpan={5} className="p-8 text-center text-sm text-[#BCAEA0]">No orders yet. Test checkout after products are published.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <div className="studio-card p-5">
          <h2 className="text-sm font-semibold text-[#FFF0E1]">Launch Alerts</h2>
          <div className="mt-4 space-y-3 text-sm">
            {stats.lowStock > 0 && <Link to="/nexora-admin/inventory" className="block rounded-2xl border border-amber-400/30 bg-amber-400/10 p-3 text-amber-100">{stats.lowStock} products need stock review.</Link>}
            {stats.pendingOrders > 0 && <Link to="/nexora-admin/orders" className="block rounded-2xl border border-[#D2B48C]/30 bg-[#D2B48C]/10 p-3 text-[#F4E8DA]">{stats.pendingOrders} orders need confirmation.</Link>}
            {stats.activeCoupons === 0 && <Link to="/nexora-admin/coupons" className="block rounded-2xl border border-[#332923] bg-[#17110F] p-3 text-[#BCAEA0]">No active coupon. Add one only when you need a campaign.</Link>}
            {stats.liveDrops === 0 && <Link to="/nexora-admin/drops" className="block rounded-2xl border border-[#332923] bg-[#17110F] p-3 text-[#BCAEA0]">No live limited drop. Limited page will show an empty brand state.</Link>}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {quickActions.map((action) => (
          <Link key={action.href} to={action.href} className="studio-card p-5 transition hover:border-[#D2B48C]">
            <action.icon className="mb-3 h-5 w-5 text-[#D2B48C]" />
            <h3 className="text-sm font-semibold text-[#FFF0E1]">{action.label}</h3>
            <p className="mt-2 text-xs leading-6 text-[#BCAEA0]">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
