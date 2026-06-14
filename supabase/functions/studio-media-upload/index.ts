import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const blocked = await requireStudio(req);
  if (blocked) return blocked;

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const productId = String(formData.get('productId') || 'draft');
    const altEn = String(formData.get('altEn') || '');
    const altAr = String(formData.get('altAr') || '');
    const isPrimary = String(formData.get('isPrimary') || 'false') === 'true';

    if (!(file instanceof File)) return json({ error: 'Image file is required.' }, 400);

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) return json({ error: 'Only JPG, PNG, and WEBP images are allowed.' }, 400);
    if (file.size > 8 * 1024 * 1024) return json({ error: 'Image is too large. Maximum size is 8MB.' }, 400);

    const ext = file.name.split('.').pop()?.toLowerCase() || 'webp';
    const safeName = file.name.replace(/[^a-z0-9.\-_]+/gi, '-').toLowerCase();
    const safeFolder = productId.replace(/[^a-zA-Z0-9-_]/g, '') || 'draft';
    const path = `${safeFolder}/${Date.now()}-${crypto.randomUUID()}-${safeName || `image.${ext}`}`;

    const supabase = serviceClient();
    const { error: uploadError } = await supabase.storage.from('products').upload(path, file, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

    if (uploadError) return json({ error: uploadError.message }, 500);

    const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(path);
    const publicUrl = publicUrlData.publicUrl;

    let image = null;
    const uuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId);

    if (uuidLike) {
      if (isPrimary) await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId);
      const { data, error } = await supabase.from('product_images').insert({
        product_id: productId,
        bucket: 'products',
        path,
        public_url: publicUrl,
        alt_en: altEn,
        alt_ar: altAr,
        is_primary: isPrimary,
      }).select('*').single();
      if (!error) image = data;
    }

    return json({ path, publicUrl, image });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Could not upload image.' }, 500);
  }
});
