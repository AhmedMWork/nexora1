import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const blocked = await requireStudio(req); if (blocked) return blocked;
  const supabase = serviceClient();
  const body = await req.json();
  try {
    if (body.action === 'list') {
      const { data: orders, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(300);
      if (error) throw error;
      const orderIds = (orders || []).map((o) => o.id);
      const { data: items } = orderIds.length ? await supabase.from('order_items').select('*').in('order_id', orderIds) : { data: [] };
      return json({ orders: orders || [], items: items || [] });
    }
    if (body.action === 'update-status') {
      const { data: order } = await supabase.from('orders').select('status_history').eq('id', body.orderId).single();
      const history = Array.isArray(order?.status_history) ? order.status_history : [];
      history.push({ status: body.status, message: body.message || `Order marked as ${body.status}`, timestamp: new Date().toISOString(), updatedBy: body.updatedBy || 'studio' });
      await supabase.from('orders').update({ order_status: body.status, status_history: history }).eq('id', body.orderId);
      return json({ ok: true });
    }
    if (body.action === 'mark-payment-collected') {
      await supabase.from('orders').update({ payment_status: 'collected' }).eq('id', body.orderId);
      return json({ ok: true });
    }
    return json({ error: 'Unknown action.' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Studio orders request failed.' }, 500);
  }
});
