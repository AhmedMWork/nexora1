-- ============================================================
-- NEXORA V4.9 Fix — Optional seed data
-- Run only if you want clean starter data. It does not delete existing data.
-- ============================================================

insert into site_settings(id, brand_name, whatsapp_number, support_email, shipping_fee, free_shipping_threshold, currency, cod_enabled, default_language, default_theme, maintenance_mode)
values ('main', 'NEXORA', '01037141322', 'supportnexorastoree@gmail.com', 60, 1500, 'EGP', true, 'ar', 'light', false)
on conflict (id) do update set
  brand_name = excluded.brand_name,
  whatsapp_number = excluded.whatsapp_number,
  support_email = excluded.support_email,
  currency = excluded.currency,
  cod_enabled = excluded.cod_enabled,
  updated_at = now();

-- Example coupon.
insert into coupons(code, title, description, type, value, min_order_amount, max_discount_amount, usage_limit, used_count, start_date, end_date, is_active, status)
values ('NEXORA10', 'Launch discount', '10% launch discount for testing checkout.', 'percentage', 10, 0, 200, 100, 0, now() - interval '1 day', now() + interval '90 days', true, 'active')
on conflict (code) do nothing;
