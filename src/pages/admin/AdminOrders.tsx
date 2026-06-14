// ============================================================
// NEXORA — Admin Orders Page
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Eye, Package, ChevronDown, RefreshCw, Search, MessageCircle, Copy, CheckCircle } from 'lucide-react';
import { formatPrice, formatTimestamp, getStatusColor, getStatusLabel, getNextStatus } from '@/lib/utils';
import { generateWhatsAppLink } from '@/lib/egyptData';
import type { Order, OrderStatus } from '@/types';
import toast from 'react-hot-toast';

const ORDER_STATUSES: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled', 'returned'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const { getOrders } = await import('@/lib/supabase/db');
      setOrders(await getOrders());
    } catch {
      toast.error('Could not load orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter ? order.status === statusFilter : true;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.customer.fullName.toLowerCase().includes(q) ||
        order.customer.phone.includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  const buildWhatsAppMessage = (order: Order) => `Hello ${order.customer.fullName}, this is NEXORA. Your COD order ${order.orderNumber} is confirmed. Total: ${formatPrice(order.total)}.`;

  const markCollected = async (orderId: string) => {
    try {
      const { markOrderPaymentCollected } = await import('@/lib/supabase/db');
      await markOrderPaymentCollected(orderId);
      setOrders((current) => current.map((o) => o.id === orderId ? { ...o, paymentStatus: 'collected' } : o));
      setSelectedOrder((current) => current?.id === orderId ? { ...current, paymentStatus: 'collected' } : current);
      toast.success('COD payment marked as collected');
    } catch {
      toast.error('Could not update payment status');
    }
  };

  const copyOrderMessage = async (order: Order) => {
    await navigator.clipboard.writeText(buildWhatsAppMessage(order));
    toast.success('WhatsApp message copied');
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { updateOrderStatus } = await import('@/lib/supabase/db');
      await updateOrderStatus(orderId, newStatus);
      setOrders((current) => current.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              updatedAt: new Date(),
              trackingUpdates: [
                ...o.trackingUpdates,
                { status: newStatus, message: `Status updated to ${getStatusLabel(newStatus)}`, timestamp: new Date(), updatedBy: 'admin' },
              ],
            }
          : o
      ));
      toast.success(`Status updated to ${getStatusLabel(newStatus)}`);
      setSelectedOrder(null);
    } catch {
      toast.error('Could not update order status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-[#f4f0e8]">Orders</h1>
          <p className="text-xs text-[#8a8175] mt-1">{orders.length} orders</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8175]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order, customer, phone..."
              className="w-full sm:w-72 bg-[#0b0b0d] border border-[#202024] pl-10 pr-4 py-2.5 text-xs text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a]"
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#0b0b0d] border border-[#202024] px-3 py-2.5 text-xs text-[#b8b0a3] focus:outline-none">
            <option value="">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
          </select>
          <button onClick={loadOrders} className="nexora-button flex items-center justify-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      <div className="bg-[#0b0b0d] border border-[#17171a] overflow-x-auto">
        <table className="w-full text-left min-w-[820px]">
          <thead>
            <tr className="border-b border-[#17171a]">
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Order #</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Customer</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Phone</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Total</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Status</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">COD</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={7} className="p-8 text-center text-xs text-[#8a8175]">Loading orders...</td></tr>
            ) : filteredOrders.length ? filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-[#17171a]/50 hover:bg-[#17171a]/30 transition-colors">
                <td className="p-4 text-xs text-[#c8a96a] font-medium">{order.orderNumber}</td>
                <td className="p-4 text-xs text-[#f4f0e8]">{order.customer.fullName}</td>
                <td className="p-4 text-xs text-[#b8b0a3]">{order.customer.phone}</td>
                <td className="p-4 text-xs font-medium">{formatPrice(order.total)}</td>
                <td className="p-4"><span className={`status-badge ${getStatusColor(order.status)} text-[9px]`}>{getStatusLabel(order.status)}</span></td>
                <td className="p-4"><span className={`text-[9px] uppercase tracking-wider border px-2 py-1 ${order.paymentStatus === 'collected' ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-[#202024] text-[#8a8175]'}`}>{order.paymentStatus === 'collected' ? 'Collected' : 'Pending'}</span></td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)} className="p-1.5 text-[#8a8175] hover:text-[#c8a96a] transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    {getNextStatus(order.status) && (
                      <button onClick={() => updateStatus(order.id, getNextStatus(order.status)! as OrderStatus)} className="flex items-center gap-1 px-2 py-1 bg-[#c8a96a]/10 text-[#c8a96a] text-[9px] uppercase tracking-wider hover:bg-[#c8a96a]/20 transition-colors">
                        <Package className="w-3 h-3" /> {getStatusLabel(getNextStatus(order.status)!)}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr><td colSpan={7} className="p-8 text-center text-xs text-[#8a8175]">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="p-5 bg-[#0b0b0d] border border-[#17171a] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#f4f0e8]">{selectedOrder.orderNumber}</h3>
            <button onClick={() => setSelectedOrder(null)} className="text-[#8a8175] hover:text-[#f4f0e8]"><ChevronDown className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#050505] border border-[#17171a]">
              <p className="text-[#8a8175] mb-1">Customer</p>
              <p className="text-[#f4f0e8]">{selectedOrder.customer.fullName}</p>
              <p className="text-[#b8b0a3]">{selectedOrder.customer.phone}</p>
              <p className="text-[#b8b0a3] mt-1">{selectedOrder.customer.address}, {selectedOrder.customer.city}, {selectedOrder.customer.governorate}</p>
            </div>
            <div className="p-3 bg-[#050505] border border-[#17171a]">
              <p className="text-[#8a8175] mb-1">Order Details</p>
              <p className="text-[#f4f0e8]">Subtotal: {formatPrice(selectedOrder.subtotal)}</p>
              <p className="text-[#b8b0a3]">Shipping: {formatPrice(selectedOrder.shippingFee)}</p>
              <p className="text-[#b8b0a3]">Date: {formatTimestamp(selectedOrder.createdAt)}</p>
              <p className="text-[#c8a96a] font-bold mt-1">Total: {formatPrice(selectedOrder.total)}</p>
              <p className="text-[#b8b0a3] mt-1">COD: {selectedOrder.paymentStatus === 'collected' ? 'Collected' : 'Pending collection'}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={generateWhatsAppLink(selectedOrder.customer.phone, buildWhatsAppMessage(selectedOrder))} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#202024] text-[9px] uppercase tracking-wider text-[#c8a96a] hover:border-[#c8a96a]"><MessageCircle className="w-3 h-3" /> WhatsApp</a>
            <button onClick={() => copyOrderMessage(selectedOrder)} className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#202024] text-[9px] uppercase tracking-wider text-[#8a8175] hover:border-[#c8a96a] hover:text-[#c8a96a]"><Copy className="w-3 h-3" /> Copy Message</button>
            <button onClick={() => markCollected(selectedOrder.id)} disabled={selectedOrder.paymentStatus === 'collected'} className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#202024] text-[9px] uppercase tracking-wider text-[#8a8175] hover:border-green-400 hover:text-green-400 disabled:opacity-50"><CheckCircle className="w-3 h-3" /> Mark Collected</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {ORDER_STATUSES.map((status) => (
              <button key={status} onClick={() => updateStatus(selectedOrder.id, status)} className={`px-3 py-1.5 text-[9px] uppercase tracking-wider border transition-colors ${selectedOrder.status === status ? 'border-[#c8a96a] text-[#c8a96a] bg-[#c8a96a]/5' : 'border-[#202024] text-[#8a8175] hover:border-[#6f675d]'}`}>
                {getStatusLabel(status)}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase tracking-wider text-[#8a8175]">Items</h4>
            {selectedOrder.items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex justify-between text-xs border-b border-[#17171a]/50 pb-2">
                <span className="text-[#f4f0e8]">{item.name} — {item.size} x{item.quantity}</span>
                <span className="text-[#b8b0a3]">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
