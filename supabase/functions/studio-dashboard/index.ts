import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const blocked = await requireStudio(req); if (blocked) return blocked;
  const supabase = serviceClient();
  try {
    const [{ data: orders }, { data: products }, { data: coupons }, { data: drops }, { data: promotions }] = await Promise.all([
      supabase.from('orders').select('total,order_status'),
      supabase.from('products').select('stock_total,status'),
      supabase.from('coupons').select('status'),
      supabase.from('drops').select('status'),
      supabase.from('promotions').select('status'),
    ]);
    const totalRevenue = (orders || []).reduce((s, o) => s + Number(o.total || 0), 0);
    return json({
      totalOrders: orders?.length || 0,
      totalRevenue,
      totalProducts: products?.length || 0,
      pendingOrders: (orders || []).filter((o) => ['pending','confirmed'].includes(o.order_status)).length,
      lowStockProducts: (products || []).filter((p) => Number(p.stock_total || 0) <= 3 && p.status === 'active').length,
      activeCoupons: (coupons || []).filter((c) => c.status === 'active').length,
      liveDrops: (drops || []).filter((d) => d.status === 'live').length,
      activePromotions: (promotions || []).filter((p) => p.status === 'active').length,
    });
  } catch (error) { return json({ error: error instanceof Error ? error.message : 'Studio dashboard request failed.' }, 500); }
});
