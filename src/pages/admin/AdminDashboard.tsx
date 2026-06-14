// ============================================================
// NEXORA — Admin Dashboard
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Package, Users, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react';
import { formatPrice, formatTimestamp, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Order, Product } from '@/types';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockCount: number;
  recentOrders: Order[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    recentOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadDashboard() {
      setIsLoading(true);
      try {
        const [{ getOrders }, { loadProducts }] = await Promise.all([
          import('@/lib/supabase/db'),
          import('@/services/productService'),
        ]);
        const [orders, products] = await Promise.all([getOrders(), loadProducts()]);
        if (!mounted) return;
        const deliveredOrActive = orders.filter((o: Order) => o.status !== 'cancelled' && o.status !== 'returned');
        const totalRevenue = deliveredOrActive.reduce((sum: number, o: Order) => sum + o.total, 0);
        const customers = new Set(orders.map((o: Order) => o.customer.phone));
        const lowStockCount = products.filter((p: Product) => p.sizes.some((s) => s.stock <= s.lowStockThreshold)).length;
        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: customers.size,
          pendingOrders: orders.filter((o: Order) => o.status === 'pending').length,
          lowStockCount,
          recentOrders: orders.slice(0, 5),
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    loadDashboard();
    return () => { mounted = false; };
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-[#c8a96a]' },
    { label: 'Total Orders', value: String(stats.totalOrders), icon: ShoppingBag, color: 'text-blue-400' },
    { label: 'Products', value: String(stats.totalProducts), icon: Package, color: 'text-purple-400' },
    { label: 'Customers', value: String(stats.totalCustomers), icon: Users, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold tracking-wider uppercase text-[#f4f0e8]">Dashboard</h1>
        <p className="text-xs text-[#8a8175] mt-1">{isLoading ? 'Loading store performance...' : 'Overview of your store performance'}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className="p-5 bg-[#0b0b0d] border border-[#17171a]">
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-5 h-5 ${card.color}`} />
              <span className="text-[10px] text-[#8a8175] uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-2xl font-bold text-[#f4f0e8]">{card.value}</p>
          </div>
        ))}
      </div>

      {stats.pendingOrders > 0 && (
        <div className="p-4 bg-amber-500/5 border border-amber-500/20 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <p className="text-xs text-amber-400">{stats.pendingOrders} pending order{stats.pendingOrders !== 1 ? 's' : ''} require attention</p>
          <Link to="/nexora-admin/orders" className="ml-auto text-[10px] text-amber-400 hover:text-amber-300 uppercase tracking-wider">View Orders</Link>
        </div>
      )}

      {stats.lowStockCount > 0 && (
        <div className="p-4 bg-red-500/5 border border-red-500/20 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <p className="text-xs text-red-400">{stats.lowStockCount} product{stats.lowStockCount !== 1 ? 's' : ''} with low stock</p>
          <Link to="/nexora-admin/inventory" className="ml-auto text-[10px] text-red-400 hover:text-red-300 uppercase tracking-wider">View Inventory</Link>
        </div>
      )}

      <div className="bg-[#0b0b0d] border border-[#17171a]">
        <div className="flex items-center justify-between p-5 border-b border-[#17171a]">
          <h2 className="text-xs font-bold tracking-wider uppercase text-[#f4f0e8]">Recent Orders</h2>
          <Link to="/nexora-admin/orders" className="text-[10px] text-[#c8a96a] hover:text-[#d8bc7e] uppercase tracking-wider flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead>
              <tr className="border-b border-[#17171a]">
                <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Order</th>
                <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Customer</th>
                <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Total</th>
                <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Status</th>
                <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length ? stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[#17171a]/50 hover:bg-[#17171a]/30 transition-colors">
                  <td className="p-4 text-xs text-[#c8a96a] font-medium">{order.orderNumber}</td>
                  <td className="p-4 text-xs text-[#f4f0e8]">{order.customer.fullName}</td>
                  <td className="p-4 text-xs text-[#f4f0e8]">{formatPrice(order.total)}</td>
                  <td className="p-4"><span className={`status-badge ${getStatusColor(order.status)} text-[9px]`}>{getStatusLabel(order.status)}</span></td>
                  <td className="p-4 text-xs text-[#8a8175]">{formatTimestamp(order.createdAt)}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="p-8 text-center text-xs text-[#8a8175]">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Add Product', desc: 'Create new product listing', href: '/nexora-admin/products' },
          { label: 'Manage Orders', desc: 'View and process orders', href: '/nexora-admin/orders' },
          { label: 'Store Settings', desc: 'Configure your store', href: '/nexora-admin/settings' },
        ].map((action) => (
          <Link key={action.label} to={action.href} className="p-5 bg-[#0b0b0d] border border-[#17171a] hover:border-[#2a2a2d] transition-all group">
            <h3 className="text-xs font-bold text-[#f4f0e8] group-hover:text-[#c8a96a] transition-colors mb-1">{action.label}</h3>
            <p className="text-[10px] text-[#8a8175]">{action.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
