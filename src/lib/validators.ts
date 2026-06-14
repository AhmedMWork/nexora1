// ============================================================
// NEXORA — Zod Validation Schemas
// ============================================================

import { z } from 'zod';
import { EGYPTIAN_PHONE_REGEX } from './egyptData';

// ─── Checkout Form ───
export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(100, 'Full name must be less than 100 characters'),
  phone: z
    .string()
    .regex(EGYPTIAN_PHONE_REGEX, 'Invalid Egyptian phone number (e.g., 01XXXXXXXX)'),
  governorate: z.string().min(1, 'Please select a governorate'),
  city: z.string().min(1, 'Please select a city'),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(300, 'Address must be less than 300 characters'),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  paymentMethod: z.enum(['cod']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// ─── Contact Form ───
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// ─── Product Form (Admin) ───
export const productSizeSchema = z.object({
  size: z.string().min(1),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(1).default(5),
});

export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.number().positive('Price must be greater than 0'),
  compareAtPrice: z.number().positive().optional(),
  category: z.enum(['men', 'women', 'unisex']),
  collection: z.string().min(1, 'Collection is required'),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
  materials: z.array(z.string()).min(1, 'At least one material is required'),
  sku: z.string().min(1, 'SKU is required'),
  tags: z.array(z.string()),
  isFeatured: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isLimitedDrop: z.boolean().default(false),
  sizes: z.array(productSizeSchema).min(1, 'At least one size is required'),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(160).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

// ─── Coupon Form (Admin) ───
export const couponFormSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20).toUpperCase(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Value must be greater than 0'),
  minOrderAmount: z.number().min(0).default(0),
  maxUses: z.number().int().positive().default(100),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  isActive: z.boolean().default(true),
});

export type CouponFormData = z.infer<typeof couponFormSchema>;

// ─── Login Form ───
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Newsletter Form ───
export const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// ─── Review Form ───
export const reviewSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  body: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ─── Admin Settings Form ───
export const siteSettingsSchema = z.object({
  storeName: z.string().min(1),
  currency: z.string().default('EGP'),
  shippingFee: z.number().min(0).default(60),
  freeShippingThreshold: z.number().min(0).default(1500),
  taxRate: z.number().min(0).max(100).default(0),
  whatsappNumber: z.string().regex(EGYPTIAN_PHONE_REGEX, 'Invalid phone number'),
  seo: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    keywords: z.string(),
  }),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
