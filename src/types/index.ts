// ============================================================
// NEXORA — Complete Type Definitions
// ============================================================

export type ProductStatus = 'draft' | 'active' | 'hidden' | 'archived' | 'sold_out';
export type ProductVisibility = 'public' | 'private' | 'scheduled';

export interface ProductColor {
  id: string;
  name: string;
  nameEn?: string;
  nameAr?: string;
  hex?: string;
  pattern?: string;
  available?: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  category: 'men' | 'women' | 'unisex';
  gender?: 'men' | 'women' | 'unisex';
  collection: string;
  dropId?: string;
  images: string[];
  thumbnail?: string;
  sizes: SizeInventory[];
  colors: Array<string | ProductColor>;
  materials: string[];
  fit?: string;
  careInstructions?: string;
  sku: string;
  tags: string[];
  status?: ProductStatus;
  visibility?: ProductVisibility;
  badges?: string[];
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedDrop: boolean;
  rating: number;
  reviewCount: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface SizeInventory {
  size: string;
  stock: number;
  lowStockThreshold: number;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  color?: string;
  colorHex?: string;
  colorPattern?: string;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  couponCode?: string;
  total: number;
  paymentMethod: 'cod';
  paymentStatus: 'pending' | 'collected' | 'failed' | 'refunded';
  status: OrderStatus;
  trackingUpdates: TrackingUpdate[];
  adminNotes?: string;
  customerNotes?: string;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  governorate: string;
  city: string;
  address: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  size: string;
  color?: string;
  colorHex?: string;
  quantity: number;
  image: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'failed';

export interface TrackingUpdate {
  status: OrderStatus;
  message: string;
  timestamp: Date;
  updatedBy?: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  isApproved: boolean;
  isFeatured: boolean;
  helpfulCount: number;
  createdAt: Date;
}

export type DiscountType = 'percentage' | 'fixed' | 'free_shipping';
export type CampaignStatus = 'draft' | 'scheduled' | 'active' | 'paused' | 'expired' | 'ended' | 'archived';

export interface Coupon {
  id: string;
  code: string;
  title?: string;
  description?: string;
  type: DiscountType;
  value: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  usageLimit: number;
  usedCount: number;
  perCustomerLimit?: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  status?: CampaignStatus;
  allowedProductIds?: string[];
  excludedProductIds?: string[];
  allowedCategories?: string[];
  excludedCategories?: string[];
  allowedCollections?: string[];
  excludedCollections?: string[];
  firstOrderOnly?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle?: string;
  type: 'storewide' | 'category' | 'collection' | 'drop' | 'product' | 'free_shipping';
  discountType: DiscountType;
  discountValue: number;
  targetIds: string[];
  status: CampaignStatus;
  startDate: Date;
  endDate: Date;
  bannerText?: string;
  showOnHome: boolean;
  showOnProduct: boolean;
  showOnCart: boolean;
  showCountdown: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Drop {
  id: string;
  name: string;
  slug: string;
  description: string;
  heroImage: string;
  status: 'draft' | 'scheduled' | 'live' | 'ended' | 'archived';
  launchDate: Date;
  endDate?: Date;
  productIds: string[];
  isLimited: boolean;
  showCountdown: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface InventoryLog {
  id: string;
  productId: string;
  sku?: string;
  size: string;
  change: number;
  reason: 'manual_adjustment' | 'new_stock' | 'order_created' | 'order_cancelled' | 'return_received' | 'damaged' | 'lost';
  previousStock: number;
  newStock: number;
  orderId?: string;
  adminId?: string;
  note?: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  adminId?: string;
  adminEmail?: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  createdAt: Date;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: Date;
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  text: string;
  link?: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

export interface SiteSettings {
  id: string;
  storeName: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  accentColor: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  taxRate: number;
  whatsappNumber: string;
  supportEmail?: string;
  codEnabled?: boolean;
  onlinePaymentEnabled?: boolean;
  maintenanceMode?: boolean;
  defaultLanguage?: 'en' | 'ar';
  defaultTheme?: 'dark' | 'light' | 'system';
  socialLinks: { instagram?: string; facebook?: string; twitter?: string; tiktok?: string; };
  seo: { title: string; description: string; keywords: string; };
  announcements: Announcement[];
  updatedAt: Date;
}

export interface Admin {
  uid: string;
  email: string;
  displayName: string;
  role: 'owner' | 'superadmin' | 'admin' | 'manager' | 'orders_manager' | 'inventory_manager' | 'content_manager' | 'viewer';
  permissions?: string[];
  createdAt: Date;
  lastLoginAt: Date;
}

export interface FilterState {
  search: string;
  category: string;
  sizes: string[];
  colors: Array<string | ProductColor>;
  minPrice: number;
  maxPrice: number;
  sortBy: 'newest' | 'price-low' | 'price-high' | 'best-selling' | 'rating';
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockProducts: number;
  recentOrders: Order[];
  salesChart: { date: string; amount: number }[];
}

export interface EgyptianGovernorate { name: string; cities: string[]; }
