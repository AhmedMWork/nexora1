import { corsHeaders, json, serviceClient } from '../_shared/studio.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const supabase = serviceClient();
  try {
    const { code, subtotal } = await req.json();
    if (!code) return json({ valid: false, discount: 0, message: 'Enter a coupon code.' });
    const { data: coupon } = await supabase.from('coupons').select('*').eq('code', String(code).toUpperCase()).eq('status', 'active').maybeSingle();
    if (!coupon) return json({ valid: false, discount: 0, message: 'Coupon is not valid.' });
    const now = Date.now();
    if (new Date(coupon.start_date).getTime() > now || new Date(coupon.end_date).getTime() < now) return json({ valid: false, discount: 0, message: 'Coupon is not active.' });
    if (Number(subtotal || 0) < Number(coupon.min_order_amount || 0)) return json({ valid: false, discount: 0, message: 'Minimum order amount has not been reached.' });
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return json({ valid: false, discount: 0, message: 'Coupon usage limit reached.' });
    let discount = 0;
    let freeShipping = false;
    if (coupon.type === 'percentage') discount = Number(subtotal || 0) * (Number(coupon.value || 0) / 100);
    if (coupon.type === 'fixed') discount = Number(coupon.value || 0);
    if (coupon.type === 'free_shipping') freeShipping = true;
    if (coupon.max_discount_amount) discount = Math.min(discount, Number(coupon.max_discount_amount));
    discount = Math.min(discount, Number(subtotal || 0));
    return json({ valid: true, code: coupon.code, discount, freeShipping, message: 'Coupon applied.' });
  } catch {
    return json({ valid: false, discount: 0, message: 'Coupon could not be validated.' });
  }
});
