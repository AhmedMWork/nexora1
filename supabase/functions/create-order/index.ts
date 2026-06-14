/* eslint-disable @typescript-eslint/no-explicit-any */
import { corsHeaders, json, serviceClient } from '../_shared/studio.ts';

type CartItem = { productId: string; size: string; quantity: number; slug?: string; image?: string };

function orderNumber() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  return `NXR-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const supabase = serviceClient();
  try {
    const body = await req.json();
    const items: CartItem[] = body.items || [];
    if (!items.length) return json({ error: 'Cart is empty.' }, 400);
    const ids = items.map((i) => i.productId);
    const { data: products, error: productsError } = await supabase.from('products').select('*').in('id', ids).eq('status', 'active');
    if (productsError) throw productsError;
    if (!products || products.length !== ids.length) return json({ error: 'Some items are unavailable.' }, 400);

    let subtotal = 0;
    const orderItems = [];
    const stockUpdates: Array<{ id: string; stockBySize: Record<string, number>; stockTotal: number; size: string; before: number; after: number; quantity: number; sku?: string }> = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return json({ error: 'Product unavailable.' }, 400);
      const qty = Math.max(1, Number(item.quantity || 1));
      const stockBySize = product.stock_by_size || {};
      const before = Number(stockBySize[item.size] ?? 0);
      if (before < qty) return json({ error: `${product.name_en} is not available in the selected quantity.` }, 400);
      const after = before - qty;
      stockBySize[item.size] = after;
      const stockTotal = Object.values(stockBySize).reduce((s: number, v: any) => s + Number(v || 0), 0);
      subtotal += Number(product.price) * qty;
      stockUpdates.push({ id: product.id, stockBySize, stockTotal, size: item.size, before, after, quantity: qty, sku: product.sku });
      orderItems.push({ product_id: product.id, product_name: product.name_en, slug: product.slug, size: item.size, quantity: qty, unit_price: Number(product.price), total: Number(product.price) * qty, image: product.images?.[0]?.public_url || product.images?.[0]?.url || item.image || '' });
    }

    const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle();
    const shippingFee = Number(settings?.shipping_fee || 0);
    const total = subtotal + shippingFee;

    const orderPayload = {
      order_number: orderNumber(),
      customer_name: body.customer?.fullName || body.customer?.name || '',
      customer_phone: body.customer?.phone || '',
      customer_email: body.customer?.email || null,
      governorate: body.customer?.governorate || '',
      city: body.customer?.city || '',
      address: body.customer?.address || '',
      notes: body.customer?.notes || body.notes || null,
      subtotal,
      discount_total: 0,
      shipping_fee: shippingFee,
      total,
      payment_method: 'cod',
      payment_status: 'pending',
      order_status: 'pending',
      status_history: [{ status: 'pending', message: 'Order received.', timestamp: new Date().toISOString(), updatedBy: 'system' }],
    };

    const { data: order, error: orderError } = await supabase.from('orders').insert(orderPayload).select('*').single();
    if (orderError) throw orderError;
    await supabase.from('order_items').insert(orderItems.map((i) => ({ ...i, order_id: order.id })));

    for (const update of stockUpdates) {
      await supabase.from('products').update({ stock_by_size: update.stockBySize, stock_total: update.stockTotal, status: update.stockTotal <= 0 ? 'sold_out' : 'active' }).eq('id', update.id);
      await supabase.from('inventory_logs').insert({ product_id: update.id, sku: update.sku, size: update.size, change: -update.quantity, reason: 'order_created', previous_stock: update.before, new_stock: update.after, order_id: order.id });
    }

    return json({ orderId: order.id, orderNumber: order.order_number, total: order.total });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Could not create order.' }, 500);
  }
});
