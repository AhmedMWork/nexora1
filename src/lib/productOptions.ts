import type { CSSProperties } from 'react';
import { PRODUCT_COLORS } from './constants';
import type { ProductColor } from '@/types';

export function normalizeColor(input: string | ProductColor | null | undefined): ProductColor | null {
  if (!input) return null;
  if (typeof input === 'object') {
    const name = input.name || input.nameEn || input.nameAr || input.id || 'Custom';
    return {
      id: input.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      nameEn: input.nameEn || input.name || name,
      nameAr: input.nameAr,
      hex: input.hex,
      pattern: input.pattern,
      available: input.available !== false,
    };
  }
  const raw = String(input).trim();
  const preset = PRODUCT_COLORS.find((c) => c.value === raw || c.label.toLowerCase() === raw.toLowerCase() || c.labelAr === raw);
  return {
    id: preset?.value || raw.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name: preset?.label || raw,
    nameEn: preset?.label || raw,
    nameAr: preset?.labelAr,
    hex: preset?.hex || undefined,
    available: true,
  };
}

export function normalizeColors(colors: Array<string | ProductColor> | null | undefined): ProductColor[] {
  return (colors || []).map(normalizeColor).filter(Boolean) as ProductColor[];
}

export function getColorDisplayName(color: string | ProductColor | null | undefined, language: 'ar' | 'en' = 'en'): string {
  const normalized = normalizeColor(color);
  if (!normalized) return '';
  return language === 'ar' ? (normalized.nameAr || normalized.nameEn || normalized.name) : (normalized.nameEn || normalized.name);
}

export function getColorStyle(color: ProductColor): CSSProperties {
  if (color.pattern) {
    return { backgroundImage: color.pattern };
  }
  if (color.hex) {
    return { backgroundColor: color.hex };
  }
  return { backgroundColor: '#D2B48C' };
}

export function colorToStorage(color: ProductColor): ProductColor {
  return {
    id: color.id,
    name: color.name,
    nameEn: color.nameEn || color.name,
    nameAr: color.nameAr,
    hex: color.hex,
    pattern: color.pattern,
    available: color.available !== false,
  };
}
