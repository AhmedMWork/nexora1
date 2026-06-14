import type { Product } from '@/types';
import { SEED_PRODUCTS } from '@/lib/seedData';
import { getProductBySlug, getProducts as getSupabaseProducts } from '@/lib/supabase/db';

const seedFallbackEnabled = import.meta.env.DEV || import.meta.env.VITE_ENABLE_SEED_FALLBACK === 'true';

export function seedProductsAsProducts(): Product[] {
  return SEED_PRODUCTS.map((p) => ({
    ...p,
    id: p.slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

function applyLocalFilters(products: Product[], filters?: Parameters<typeof getSupabaseProducts>[0]): Product[] {
  return products.filter((product) => {
    if (filters?.category && product.category !== filters.category) return false;
    if (filters?.isFeatured && !product.isFeatured) return false;
    if (filters?.isNewArrival && !product.isNewArrival) return false;
    if (filters?.isBestSeller && !product.isBestSeller) return false;
    if (filters?.isLimitedDrop && !product.isLimitedDrop) return false;
    return true;
  });
}

export async function loadProducts(filters?: Parameters<typeof getSupabaseProducts>[0]): Promise<Product[]> {
  try {
    const products = await getSupabaseProducts(filters);
    if (products.length > 0) return products;
  } catch (error) {
    console.warn('Could not load products from Supabase:', error);
  }
  if (!seedFallbackEnabled) return [];
  return applyLocalFilters(seedProductsAsProducts(), filters);
}

export async function loadProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await getProductBySlug(slug);
    if (product) return product;
  } catch (error) {
    console.warn('Could not load product from Supabase:', error);
  }
  if (!seedFallbackEnabled) return null;
  return seedProductsAsProducts().find((product) => product.slug === slug) || null;
}
