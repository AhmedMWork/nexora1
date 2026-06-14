import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().slice(2, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NXR-${datePart}-${randomPart}`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    preparing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    packed: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
    shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    out_for_delivery: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    returned: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    failed: 'bg-red-900/20 text-red-300 border-red-900/30',
  };
  return colors[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
}

export function getStatusLabel(status: string, lang: 'en' | 'ar' = 'en'): string {
  const labels: Record<'en' | 'ar', Record<string, string>> = {
    en: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      packed: 'Packed',
      shipped: 'Shipped',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned',
      failed: 'Failed',
    },
    ar: {
      pending: 'قيد المراجعة',
      confirmed: 'تم التأكيد',
      preparing: 'جاري التجهيز',
      out_for_delivery: 'خرج للتوصيل',
      delivered: 'تم التسليم',
      cancelled: 'تم الإلغاء',
      returned: 'مرتجع',
      failed: 'فشل الطلب',
    },
  };
  return labels[lang][status] || status;
}

export function getNextStatus(currentStatus: string): string | null {
  const flow: Record<string, string> = {
    pending: 'confirmed',
    confirmed: 'preparing',
    preparing: 'out_for_delivery',
    out_for_delivery: 'delivered',
  };
  return flow[currentStatus] || null;
}

export function calculateDiscount(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^20/, '0');
}

export function formatTimestamp(value: unknown, locale = 'en-EG'): string {
  if (!value) return '';
  if (value instanceof Date) return value.toLocaleDateString(locale);
  if (typeof value === 'object' && value !== null && 'toDate' in value && typeof (value as { toDate: () => Date }).toDate === 'function') {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString(locale);
  }
  return new Date(value as string | number).toLocaleDateString(locale);
}
