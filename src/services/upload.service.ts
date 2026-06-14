import { supabase } from '@/lib/supabase/client';

const BUCKET = 'products';

export function validateImageFile(file: File): void {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) throw new Error('Only JPG, PNG, and WEBP images are supported.');
  if (file.size > 6 * 1024 * 1024) throw new Error('Image must be smaller than 6MB.');
}

export async function uploadProductImage(file: File, productSlugOrId = 'draft'): Promise<string> {
  validateImageFile(file);
  const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
  const safeName = file.name.replace(/[^a-z0-9.\-_]+/gi, '-').toLowerCase();
  const path = `${productSlugOrId}/${Date.now()}-${safeName || `image.${ext}`}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '31536000',
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new Error(error.message || 'Image upload failed.');
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteProductImage(publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(publicUrl.slice(idx + marker.length));
  await supabase.storage.from(BUCKET).remove([path]);
}
