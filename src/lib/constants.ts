// ============================================================
// NEXORA — Constants & Configuration
// ============================================================

export const SITE_NAME = 'NEXORA';
export const SITE_TAGLINE = 'Quiet Luxury. Limited By Design.';
export const SITE_DESCRIPTION = 'Limited fashion essentials by NEXORA. Refined silhouettes, COD ordering, and a world-class ivory noir experience.';
export const SITE_URL = 'https://nexora.store';

export const NAV_LINKS = [
  { label: 'Shop', href: '/shop' },
  { label: 'Men', href: '/shop/men' },
  { label: 'Women', href: '/shop/women' },
  { label: 'Unisex', href: '/shop/unisex' },
  { label: 'Limited', href: '/limited' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
];

export const PRODUCT_CATEGORIES = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'unisex', label: 'Unisex' },
];

export const PRODUCT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const PRODUCT_COLORS = [
  { value: 'black', label: 'Black', hex: '#000000' },
  { value: 'white', label: 'White', hex: '#FFFFFF' },
  { value: 'gray', label: 'Gray', hex: '#808080' },
  { value: 'navy', label: 'Navy', hex: '#000080' },
  { value: 'beige', label: 'Beige', hex: '#F5F5DC' },
  { value: 'sage', label: 'Sage', hex: '#9CAF88' },
  { value: 'terracotta', label: 'Terracotta', hex: '#E2725B' },
  { value: 'cream', label: 'Cream', hex: '#FFFDD0' },
];

export const MATERIALS = [
  '100% Organic Cotton',
  'Premium Cotton Blend',
  'Egyptian Cotton',
  'Pima Cotton',
  'Linen Blend',
  'Bamboo Cotton',
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'rating', label: 'Highest Rated' },
];

export const PRICE_RANGES = [
  { label: 'Under 500 EGP', min: 0, max: 500 },
  { label: '500 - 800 EGP', min: 500, max: 800 },
  { label: '800 - 1200 EGP', min: 800, max: 1200 },
  { label: '1200 - 1500 EGP', min: 1200, max: 1500 },
  { label: 'Over 1500 EGP', min: 1500, max: 10000 },
];

export const SHIPPING_FEE = 60;
export const FREE_SHIPPING_THRESHOLD = 1500;

export const ORDER_STATUS_FLOW = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
] as const;

export const ADMIN_NAV_LINKS = [
  { label: 'Dashboard', href: '/nexora-admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/nexora-admin/products', icon: 'Package' },
  { label: 'Orders', href: '/nexora-admin/orders', icon: 'ShoppingBag' },
  { label: 'Inventory', href: '/nexora-admin/inventory', icon: 'Warehouse' },
  { label: 'Reviews', href: '/nexora-admin/reviews', icon: 'Star' },
  { label: 'Coupons', href: '/nexora-admin/coupons', icon: 'Tag' },
  { label: 'Promotions', href: '/nexora-admin/promotions', icon: 'BadgePercent' },
  { label: 'Limited Drops', href: '/nexora-admin/drops', icon: 'CalendarClock' },
  { label: 'Settings', href: '/nexora-admin/settings', icon: 'Settings' },
  { label: 'Audit Logs', href: '/nexora-admin/audit-logs', icon: 'ShieldCheck' },
];

export const BRAND_VALUES = [
  {
    title: 'Premium Fabrics',
    description: 'Sourced from the finest mills. Egyptian cotton, organic blends, and innovative sustainable materials.',
    icon: 'Diamond',
  },
  {
    title: 'Precision Fit',
    description: 'Engineered patterns with meticulous attention to proportions. Every size fits intentionally.',
    icon: 'Ruler',
  },
  {
    title: 'Local Craftsmanship',
    description: 'Proudly designed and manufactured in Egypt. Supporting local artisans and communities.',
    icon: 'Heart',
  },
  {
    title: 'Sustainable Practice',
    description: 'Eco-conscious production with minimal waste. Packaging made from recycled materials.',
    icon: 'Leaf',
  },
];

export const FOOTER_LINKS = {
  shop: [
    { label: 'All Products', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Limited Drops', href: '/limited' },
    { label: 'Best Sellers', href: '/shop?sort=best-selling' },
    { label: 'Men\'s T-Shirts', href: '/shop/men' },
    { label: 'Women\'s T-Shirts', href: '/shop/women' },
    { label: 'Unisex Essentials', href: '/shop/unisex' },
  ],
  support: [
        { label: 'Size Guide', href: '/info/size-guide' },
    { label: 'Shipping & Returns', href: '/info/shipping-returns' },
    { label: 'FAQ', href: '/info/faq' },
  ],
  company: [
    { label: 'About NEXORA', href: '/info/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/info/privacy' },
  ],
};
