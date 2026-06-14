import { supabase, ensureStudioToken } from '@/lib/supabase/client';

const BUCKET = 'products';

export function validateImageFile(file: File): void {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) throw new Error('Only JPG, PNG, and WEBP images are supported.');
  if (file.size > 8 * 1024 * 1024) throw new Error('Image must be smaller than 8MB.');
}

export async function uploadProductImage(file: File, productSlugOrId = 'draft'): Promise<string> {
  validateImageFile(file);
  const token = await ensureStudioToken();
  const form = new FormData();
  form.append('file', file);
  form.append('productId', productSlugOrId || 'draft');

  const { data, error } = await supabase.functions.invoke<{ publicUrl: string }>('studio-media-upload', {
    body: form,
    headers: { 'x-studio-token': token },
  });

  if (error || !data?.publicUrl) throw new Error(error?.message || 'Image upload failed.');
  return data.publicUrl;
}

export async function deleteProductImage(publicUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return;
  const path = decodeURIComponent(publicUrl.slice(idx + marker.length));
  const token = await ensureStudioToken();
  const { error } = await supabase.functions.invoke('studio-media-delete', {
    body: { path },
    headers: { 'x-studio-token': token },
  });
  if (error) throw new Error(error.message || 'Image delete failed.');
}
