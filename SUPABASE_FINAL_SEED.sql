-- ============================================================
-- NEXORA V4.9 OPTIONAL SEED DATA
-- Use only if you want starter settings/coupons/reviews.
-- ============================================================

insert into site_settings(id, brand_name, whatsapp_number, support_email, shipping_fee, free_shipping_threshold, currency, cod_enabled, default_language, default_theme, maintenance_mode)
values ('main', 'NEXORA', '01037141322', 'supportnexorastoree@gmail.com', 60, 1500, 'EGP', true, 'ar', 'light', false)
on conflict (id) do update set
  brand_name = excluded.brand_name,
  whatsapp_number = excluded.whatsapp_number,
  support_email = excluded.support_email,
  shipping_fee = excluded.shipping_fee,
  free_shipping_threshold = excluded.free_shipping_threshold,
  currency = excluded.currency,
  cod_enabled = excluded.cod_enabled,
  default_language = excluded.default_language,
  default_theme = excluded.default_theme,
  maintenance_mode = excluded.maintenance_mode;

insert into coupons(code, title, description, type, value, min_order_amount, usage_limit, used_count, status, start_date, end_date)
values ('NEXORA10', 'Launch Discount', '10% launch discount for testing the coupon flow.', 'percentage', 10, 500, 100, 0, 'active', now(), now() + interval '90 days')
on conflict (code) do nothing;
