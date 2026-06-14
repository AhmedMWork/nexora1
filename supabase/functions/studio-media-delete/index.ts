import { corsHeaders, json, requireStudio, serviceClient } from '../_shared/studio.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const blocked = await requireStudio(req);
  if (blocked) return blocked;

  try {
    const { path, imageId } = await req.json();
    if (!path && !imageId) return json({ error: 'Image path or imageId is required.' }, 400);

    const supabase = serviceClient();
    let filePath = path ? String(path) : '';

    if (!filePath && imageId) {
      const { data, error } = await supabase.from('product_images').select('path').eq('id', imageId).maybeSingle();
      if (error || !data?.path) return json({ error: 'Image not found.' }, 404);
      filePath = data.path;
    }

    const { error: removeError } = await supabase.storage.from('products').remove([filePath]);
    if (removeError) return json({ error: removeError.message }, 500);

    if (imageId) await supabase.from('product_images').delete().eq('id', imageId);
    else await supabase.from('product_images').delete().eq('path', filePath);

    return json({ success: true, path: filePath });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Could not delete image.' }, 500);
  }
});
