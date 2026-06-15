// ============================================================
// NEXORA — Constants & Configuration
// ============================================================

export const SITE_NAME = 'NEXORA';
export const SITE_TAGLINE = 'Quiet Luxury. Ready For Every Day.';
export const SITE_DESCRIPTION = 'NEXORA is a refined Egyptian fashion store for quiet premium essentials, cash-on-delivery orders, clear returns, and a luxury Arabic/English shopping experience.';
export const SITE_URL = 'https://nexora1-one.vercel.app';

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
  { value: 'men', label: 'Men', labelAr: 'رجالي' },
  { value: 'women', label: 'Women', labelAr: 'نسائي' },
  { value: 'unisex', label: 'Unisex', labelAr: 'يونيسكس' },
  { value: 'custom', label: 'Custom', labelAr: 'مخصص' },
];

export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];

export const PRODUCT_COLORS = [
  { value: 'black', label: 'Black', labelAr: 'أسود', hex: '#0E0B0A' },
  { value: 'ivory', label: 'Ivory', labelAr: 'عاجي', hex: '#F7F1E8' },
  { value: 'white', label: 'White', labelAr: 'أبيض', hex: '#FFFFFF' },
  { value: 'mocha', label: 'Mocha', labelAr: 'موكا', hex: '#6F5B51' },
  { value: 'sand', label: 'Sand', labelAr: 'رملي', hex: '#D8C9B8' },
  { value: 'dust-rose', label: 'Dust Rose', labelAr: 'وردي ترابي', hex: '#B88A78' },
  { value: 'navy', label: 'Navy', labelAr: 'كحلي', hex: '#1E2A3A' },
  { value: 'olive', label: 'Olive', labelAr: 'زيتوني', hex: '#73715F' },
  { value: 'grey', label: 'Grey', labelAr: 'رمادي', hex: '#8C8983' },
  { value: 'custom', label: 'Custom', labelAr: 'لون مخصص', hex: '#D2B48C' },
];

export const MATERIALS = [
  'Premium Cotton Blend',
  '100% Cotton',
  'Egyptian Cotton',
  'Heavyweight Cotton',
  'Soft Jersey Cotton',
  'French Terry',
  'Linen Blend',
  'Custom Material',
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
  { label: 'Overview', href: '/nexora-admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Products', href: '/nexora-admin/products', icon: 'Package' },
  { label: 'Orders', href: '/nexora-admin/orders', icon: 'ShoppingBag' },
  { label: 'Customers', href: '/nexora-admin/customers', icon: 'UserRound' },
  { label: 'Inventory', href: '/nexora-admin/inventory', icon: 'Warehouse' },
  { label: 'Coupons', href: '/nexora-admin/coupons', icon: 'Tag' },
  { label: 'Limited Drops', href: '/nexora-admin/drops', icon: 'CalendarClock' },
  { label: 'Reviews', href: '/nexora-admin/reviews', icon: 'Star' },
  { label: 'Analytics', href: '/nexora-admin/analytics', icon: 'BarChart3' },
  { label: 'SEO', href: '/nexora-admin/seo', icon: 'SearchCheck' },
  { label: 'System Health', href: '/nexora-admin/system-health', icon: 'ShieldCheck' },
];

export const BRAND_VALUES = [
  {
    title: 'Simple Ordering',
    description: 'Choose your piece, add it to cart, and confirm the order through a clear cash-on-delivery flow.',
    icon: 'ShoppingBag',
  },
  {
    title: 'Everyday Comfort',
    description: 'Clean finishing and comfortable materials designed for daily wear without exaggerated claims.',
    icon: 'Heart',
  },
  {
    title: 'Close Support',
    description: 'Questions about size, order confirmation, and returns are handled through WhatsApp and contact forms.',
    icon: 'MessageCircle',
  },
  {
    title: 'Clear Returns',
    description: 'Returns are available within 14 days when the item is unused and kept in its original condition.',
    icon: 'RefreshCw',
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
    { label: 'Shipping & Returns', href: '/info/shipping-returns' },
    { label: 'FAQ', href: '/info/faq' },
    { label: 'WhatsApp Support', href: '/contact' },
  ],
  company: [
    { label: 'About NEXORA', href: '/info/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/info/privacy' },
  ],
};
