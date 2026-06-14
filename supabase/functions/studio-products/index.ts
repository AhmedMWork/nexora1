/* eslint-disable @typescript-eslint/no-explicit-any */
import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const blocked = await requireStudio(req); if (blocked) return blocked;
  const supabase = serviceClient();
  const body = await req.json();
  try {
    if (body.action === 'list') {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return json({ products: data || [] });
    }
    if (body.action === 'create') {
      const { data, error } = await supabase.from('products').insert(body.product).select('id').single();
      if (error) throw error;
      return json({ id: data.id });
    }
    if (body.action === 'update') {
      const { error } = await supabase.from('products').update(body.product).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }
    if (body.action === 'archive') {
      const { error } = await supabase.from('products').update({ status: 'archived' }).eq('id', body.id);
      if (error) throw error;
      return json({ ok: true });
    }
    if (body.action === 'adjust-stock') {
      const { data: product, error } = await supabase.from('products').select('*').eq('id', body.productId).single();
      if (error) throw error;
      const stock = product.stock_by_size || {};
      const before = Number(stock[body.size] || 0);
      const after = Math.max(0, before + Number(body.quantity || 0));
      stock[body.size] = after;
      const total = Object.values(stock).reduce((s: number, v: any) => s + Number(v || 0), 0);
      await supabase.from('products').update({ stock_by_size: stock, stock_total: total, status: total <= 0 ? 'sold_out' : product.status === 'sold_out' ? 'active' : product.status }).eq('id', body.productId);
      await supabase.from('inventory_logs').insert({ product_id: body.productId, size: body.size, change: Number(body.quantity || 0), reason: body.reason || 'manual_adjustment', previous_stock: before, new_stock: after, note: body.note });
      return json({ ok: true });
    }
    if (body.action === 'inventory-logs') {
      let q = supabase.from('inventory_logs').select('*').order('created_at', { ascending: false }).limit(200);
      if (body.productId) q = q.eq('product_id', body.productId);
      const { data, error } = await q;
      if (error) throw error;
      return json({ logs: data || [] });
    }
    return json({ error: 'Unknown action.' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Studio products request failed.' }, 500);
  }
});
