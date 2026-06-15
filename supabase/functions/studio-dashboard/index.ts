import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const blocked = await requireStudio(req); if (blocked) return blocked;
  const supabase = serviceClient();
  const body = await req.json().catch(() => ({}));

  try {
    if (body.action === 'analytics') {
      const since = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString();
      const [{ data: events }, { data: orders }] = await Promise.all([
        supabase.from('analytics_events').select('*').gte('created_at', since).order('created_at', { ascending: false }).limit(5000),
        supabase.from('orders').select('id,order_number,total,order_status,customer_name,customer_phone,customer_email,governorate,city,created_at').gte('created_at', since).order('created_at', { ascending: false }).limit(1000),
      ]);
      const sessions = new Set((events || []).map((event) => event.session_id).filter(Boolean));
      const productNames = new Map<string, number>();
      for (const event of events || []) {
        if (['product_view', 'add_to_cart', 'remove_from_cart'].includes(event.event_name)) {
          const payload = event.payload || {};
          const name = payload.productName || payload.name || payload.productId || 'Unknown product';
          productNames.set(String(name), (productNames.get(String(name)) || 0) + 1);
        }
      }
      return json({
        events: events || [],
        orders: orders || [],
        summary: {
          sessions: sessions.size,
          productInterest: [...productNames.entries()].sort((a, b) => b[1] - a[1]).slice(0, 20),
        },
      });
    }

    const [{ data: orders }, { data: products }, { data: coupons }, { data: drops }] = await Promise.all([
      supabase.from('orders').select('total,order_status'),
      supabase.from('products').select('stock_total,status'),
      supabase.from('coupons').select('status'),
      supabase.from('drops').select('status'),
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
      activePromotions: 0,
    });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Studio dashboard request failed.' }, 500);
  }
});
