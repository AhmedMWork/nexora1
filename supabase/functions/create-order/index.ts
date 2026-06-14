/* eslint-disable @typescript-eslint/no-explicit-any */
import { corsHeaders, json, serviceClient } from '../_shared/studio.ts';

type CartItem = { productId: string; size: string; quantity: number; slug?: string; image?: string; color?: string };

function orderNumber() {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  return `NXR-${ymd}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function normalizeCode(code: unknown) {
  return String(code || '').trim().toUpperCase();
}

function couponDiscount(coupon: any, subtotal: number) {
  let discount = 0;
  let freeShipping = false;
  if (coupon.type === 'percentage') discount = subtotal * (Number(coupon.value || 0) / 100);
  if (coupon.type === 'fixed') discount = Number(coupon.value || 0);
  if (coupon.type === 'free_shipping') freeShipping = true;
  if (coupon.max_discount_amount) discount = Math.min(discount, Number(coupon.max_discount_amount));
  discount = Math.max(0, Math.min(discount, subtotal));
  return { discount, freeShipping };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const supabase = serviceClient();

  try {
    const body = await req.json();
    const items: CartItem[] = body.items || [];
    if (!items.length) return json({ error: 'Cart is empty.' }, 400);

    const ids = [...new Set(items.map((i) => i.productId).filter(Boolean))];
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', ids)
      .eq('status', 'active');

    if (productsError) throw productsError;
    if (!products || products.length !== ids.length) return json({ error: 'Some items are unavailable.' }, 400);

    let subtotal = 0;
    const orderItems = [];
    const stockUpdates: Array<{ id: string; stockBySize: Record<string, number>; stockTotal: number; size: string; before: number; after: number; quantity: number; sku?: string }> = [];

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return json({ error: 'Product unavailable.' }, 400);

      const qty = Math.max(1, Number(item.quantity || 1));
      const size = String(item.size || '').trim().toUpperCase();
      if (!size) return json({ error: 'Please select a size for every item.' }, 400);

      const stockBySize = { ...(product.stock_by_size || {}) };
      const before = Number(stockBySize[size] ?? 0);
      if (before < qty) return json({ error: `${product.name_en} is not available in the selected quantity.` }, 400);

      const after = before - qty;
      stockBySize[size] = after;
      const stockTotal = Object.values(stockBySize).reduce((s: number, v: any) => s + Number(v || 0), 0);
      const unitPrice = Number(product.price || 0);
      subtotal += unitPrice * qty;

      stockUpdates.push({ id: product.id, stockBySize, stockTotal, size, before, after, quantity: qty, sku: product.sku });
      orderItems.push({
        product_id: product.id,
        product_name: product.name_en,
        slug: product.slug,
        size,
        color: item.color || null,
        quantity: qty,
        unit_price: unitPrice,
        total: unitPrice * qty,
        image: product.images?.[0]?.public_url || product.images?.[0]?.url || product.images?.[0] || item.image || '',
      });
    }

    const { data: settings } = await supabase.from('site_settings').select('*').eq('id', 'main').maybeSingle();
    const baseShippingFee = Number(settings?.shipping_fee || 0);
    const freeShippingThreshold = Number(settings?.free_shipping_threshold || 0);

    let discountTotal = 0;
    let freeShippingByCoupon = false;
    let couponCode: string | null = null;

    const requestedCoupon = normalizeCode(body.couponCode);
    if (requestedCoupon) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', requestedCoupon)
        .eq('status', 'active')
        .maybeSingle();

      if (!coupon) return json({ error: 'Coupon is not valid.' }, 400);
      const now = Date.now();
      if (new Date(coupon.start_date).getTime() > now || new Date(coupon.end_date).getTime() < now) return json({ error: 'Coupon is not active.' }, 400);
      if (Number(subtotal || 0) < Number(coupon.min_order_amount || 0)) return json({ error: 'Minimum order amount has not been reached.' }, 400);
      if (coupon.usage_limit && Number(coupon.used_count || 0) >= Number(coupon.usage_limit || 0)) return json({ error: 'Coupon usage limit reached.' }, 400);

      const result = couponDiscount(coupon, subtotal);
      discountTotal = result.discount;
      freeShippingByCoupon = result.freeShipping;
      couponCode = coupon.code;
    }

    const shippingFee = freeShippingByCoupon || (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) ? 0 : baseShippingFee;
    const total = Math.max(0, subtotal - discountTotal + shippingFee);

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
      discount_total: discountTotal,
      shipping_fee: shippingFee,
      total,
      payment_method: 'cod',
      payment_status: 'pending',
      order_status: 'pending',
      coupon_code: couponCode,
      source: 'web',
      status_history: [{ status: 'pending', message: 'Order received.', timestamp: new Date().toISOString(), updatedBy: 'system' }],
    };

    if (!orderPayload.customer_name || !orderPayload.customer_phone || !orderPayload.address) {
      return json({ error: 'Customer name, phone, and address are required.' }, 400);
    }

    const { data: order, error: orderError } = await supabase.from('orders').insert(orderPayload).select('*').single();
    if (orderError) throw orderError;

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems.map((i) => ({ ...i, order_id: order.id })));
    if (itemsError) throw itemsError;

    for (const update of stockUpdates) {
      await supabase.from('products').update({
        stock_by_size: update.stockBySize,
        stock_total: update.stockTotal,
        status: update.stockTotal <= 0 ? 'sold_out' : 'active',
      }).eq('id', update.id);

      await supabase.from('inventory_logs').insert({
        product_id: update.id,
        sku: update.sku,
        size: update.size,
        change: -update.quantity,
        reason: 'order_created',
        previous_stock: update.before,
        new_stock: update.after,
        order_id: order.id,
      });
    }

    if (couponCode) {
      await supabase.rpc('increment_coupon_usage', { code_value: couponCode }).then(async ({ error }) => {
        if (error) {
          const { data: current } = await supabase.from('coupons').select('used_count').eq('code', couponCode).maybeSingle();
          await supabase.from('coupons').update({ used_count: Number(current?.used_count || 0) + 1 }).eq('code', couponCode);
        }
      });
    }

    return json({ orderId: order.id, orderNumber: order.order_number, total: order.total });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Could not create order.' }, 500);
  }
});
