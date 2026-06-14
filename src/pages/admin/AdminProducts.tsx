// ============================================================
// NEXORA — Admin Products Page
// ============================================================

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, X, RefreshCw, Upload, Eye } from 'lucide-react';
import { formatPrice, generateSlug } from '@/lib/utils';
import type { Product } from '@/types';
import toast from 'react-hot-toast';
import { uploadProductImage } from '@/services/upload.service';

type ProductFormMode = 'list' | 'create' | 'edit';

interface ProductDraft {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: 'men' | 'women' | 'unisex';
  collection: string;
  images: string;
  colors: string;
  materials: string;
  sku: string;
  tags: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedDrop: boolean;
  status: 'draft' | 'active' | 'hidden' | 'archived' | 'sold_out';
  sizes: string;
  fit: string;
  careInstructions: string;
}

const emptyDraft: ProductDraft = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  category: 'men',
  collection: 'core',
  images: '',
  colors: 'black',
  materials: 'Premium Cotton Blend',
  sku: '',
  tags: 't-shirt, premium',
  isFeatured: false,
  isNewArrival: true,
  isBestSeller: false,
  isLimitedDrop: false,
  status: 'active',
  sizes: 'S:10, M:10, L:10, XL:10',
  fit: 'Regular fit',
  careInstructions: 'Wash inside out with similar colors. Do not bleach.',
};

const productFlagFields = [
  { key: 'isFeatured', label: 'Featured' },
  { key: 'isNewArrival', label: 'New Arrival' },
  { key: 'isBestSeller', label: 'Best Seller' },
  { key: 'isLimitedDrop', label: 'Limited Drop' },
] as const satisfies ReadonlyArray<{ key: keyof Pick<ProductDraft, 'isFeatured' | 'isNewArrival' | 'isBestSeller' | 'isLimitedDrop'>; label: string }>;

export default function AdminProducts() {
  const [mode, setMode] = useState<ProductFormMode>('list');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const { getAdminProducts } = await import('@/lib/supabase/db');
      setProducts(await getAdminProducts());
    } catch {
      toast.error('Could not load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const filteredProducts = useMemo(() => products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  ), [products, searchQuery]);

  const openCreate = () => {
    setEditingProduct(null);
    setDraft(emptyDraft);
    setMode('create');
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setDraft({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      collection: product.collection,
      images: product.images.join('\n'),
      colors: product.colors.join(', '),
      materials: product.materials.join(', '),
      sku: product.sku,
      tags: product.tags.join(', '),
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      isLimitedDrop: product.isLimitedDrop,
      status: product.status || 'active',
      sizes: product.sizes.map((s) => `${s.size}:${s.stock}`).join(', '),
      fit: product.fit || 'Regular fit',
      careInstructions: product.careInstructions || 'Wash inside out with similar colors. Do not bleach.',
    });
    setMode('edit');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      const { deleteProduct } = await import('@/lib/supabase/db');
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Could not delete product');
    }
  };

  const handleImageUpload = async (file?: File | null) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadProductImage(file, draft.slug || generateSlug(draft.name || 'product'));
      setDraft((current) => ({
        ...current,
        images: [current.images, url].filter(Boolean).join('\n'),
      }));
      toast.success('Image uploaded to Supabase Storage');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };


  const saveProduct = async () => {
    let imageList: string[];
    try {
      imageList = draft.images.split(/[\n,]/).map((v) => v.trim()).filter(Boolean);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Invalid product image link');
      return;
    }
    if (!draft.name || !draft.price || !draft.sku || imageList.length === 0) {
      toast.error('Name, price, SKU, and at least one image are required');
      return;
    }

    const sizes = draft.sizes.split(',').map((entry) => { const [size, stock] = entry.split(':').map((v) => v.trim()); return { size: size.toUpperCase(), stock: Number(stock || 0), lowStockThreshold: 3 }; }).filter((size) => size.size && Number.isFinite(size.stock) && size.stock >= 0);
    if (sizes.length === 0) {
      toast.error('Add at least one valid size as S:10, M:8');
      return;
    }

    const payload = {
      name: draft.name,
      slug: draft.slug || generateSlug(draft.name),
      description: draft.description || `${draft.name} by NEXORA.`,
      price: Number(draft.price),
      compareAtPrice: draft.compareAtPrice ? Number(draft.compareAtPrice) : undefined,
      category: draft.category,
      collection: draft.collection || 'core',
      images: imageList,
      thumbnail: imageList[0],
      sizes,
      colors: draft.colors.split(',').map((v) => v.trim()).filter(Boolean),
      materials: draft.materials.split(',').map((v) => v.trim()).filter(Boolean),
      sku: draft.sku,
      tags: draft.tags.split(',').map((v) => v.trim()).filter(Boolean),
      isFeatured: draft.isFeatured,
      isNewArrival: draft.isNewArrival,
      isBestSeller: draft.isBestSeller,
      isLimitedDrop: draft.isLimitedDrop,
      status: draft.status,
      visibility: draft.status === 'active' ? ('public' as const) : ('private' as const),
      fit: draft.fit,
      careInstructions: draft.careInstructions,
      rating: editingProduct?.rating || 0,
      reviewCount: editingProduct?.reviewCount || 0,
      seoTitle: `${draft.name} | NEXORA`,
      seoDescription: draft.description.slice(0, 155) || `${draft.name} by NEXORA`,
    };

    try {
      const { createProduct, updateProduct } = await import('@/lib/supabase/db');
      if (mode === 'edit' && editingProduct) {
        await updateProduct(editingProduct.id, payload);
        toast.success('Product updated');
      } else {
        await createProduct(payload);
        toast.success('Product created');
      }
      setMode('list');
      loadCatalog();
    } catch {
      toast.error('Could not save product');
    }
  };

  const updateDraft = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const firstImage = draft.images.split(/[\n,]/).map((v) => v.trim()).filter(Boolean)[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-[#f4f0e8]">Products</h1>
          <p className="text-xs text-[#8a8175] mt-1">{products.length} products in catalog</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadCatalog} className="nexora-button flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-[#c8a96a] text-[#050505] text-xs font-bold tracking-wider uppercase hover:bg-[#d8bc7e] transition-colors"><Plus className="w-3.5 h-3.5" />Add Product</button>
        </div>
      </div>

      {mode === 'list' && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8175]" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0b0b0d] border border-[#202024] pl-10 pr-4 py-2.5 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a]" />
          </div>

          <div className="bg-[#0b0b0d] border border-[#17171a] overflow-x-auto">
            <table className="w-full text-left min-w-[820px]">
              <thead>
                <tr className="border-b border-[#17171a]">
                  <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Image</th>
                  <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Name</th>
                  <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">SKU</th>
                  <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Price</th>
                  <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Stock</th>
                  <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Category</th>
                  <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-xs text-[#8a8175]">Loading products...</td></tr>
                ) : filteredProducts.map((product) => {
                  const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
                  return (
                    <tr key={product.id} className="border-b border-[#17171a]/50 hover:bg-[#17171a]/30 transition-colors">
                      <td className="p-4"><img src={product.images[0]} alt={product.name} className="w-10 h-10 object-cover bg-[#050505]" /></td>
                      <td className="p-4"><Link to={`/product/${product.slug}`} className="text-xs text-[#f4f0e8] hover:text-[#c8a96a] transition-colors">{product.name}</Link></td>
                      <td className="p-4 text-xs text-[#b8b0a3]">{product.sku}</td>
                      <td className="p-4 text-xs text-[#c8a96a] font-medium">{formatPrice(product.price)}{product.compareAtPrice && <span className="text-[10px] text-[#8a8175] line-through ml-1">{formatPrice(product.compareAtPrice)}</span>}</td>
                      <td className="p-4"><span className={`text-xs ${totalStock <= 10 ? 'text-red-400' : 'text-[#b8b0a3]'}`}>{totalStock} units</span></td>
                      <td className="p-4"><span className="text-[10px] px-2 py-1 bg-[#17171a] text-[#b8b0a3] uppercase tracking-wider">{product.category}</span></td>
                      <td className="p-4"><div className="flex items-center gap-2"><button onClick={() => openEdit(product)} className="p-1.5 text-[#8a8175] hover:text-[#c8a96a] transition-colors"><Edit className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete(product.id)} className="p-1.5 text-[#8a8175] hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <div className="p-6 bg-[#0b0b0d] border border-[#17171a]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-wider uppercase text-[#f4f0e8]">{mode === 'create' ? 'Add New Product' : 'Edit Product'}</h2>
            <button onClick={() => setMode('list')} className="p-1.5 text-[#8a8175] hover:text-[#f4f0e8]"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <input value={draft.name} onChange={(e) => updateDraft('name', e.target.value)} placeholder="Product name" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <input value={draft.slug} onChange={(e) => updateDraft('slug', e.target.value)} placeholder="Slug auto-generated if empty" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <input type="number" value={draft.price} onChange={(e) => updateDraft('price', Number(e.target.value))} placeholder="Price" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <input type="number" value={draft.compareAtPrice || ''} onChange={(e) => updateDraft('compareAtPrice', e.target.value ? Number(e.target.value) : undefined)} placeholder="Compare at price" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <select value={draft.category} onChange={(e) => updateDraft('category', e.target.value as 'men' | 'women' | 'unisex')} className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]"><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option></select>
            <input value={draft.collection} onChange={(e) => updateDraft('collection', e.target.value)} placeholder="Collection" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <input value={draft.sku} onChange={(e) => updateDraft('sku', e.target.value)} placeholder="SKU" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <div className="sm:col-span-2 space-y-3">
              <label className="text-[10px] text-[#8a8175] uppercase tracking-wider block">Supabase Storage image URLs</label>
              <textarea value={draft.images} onChange={(e) => updateDraft('images', e.target.value)} placeholder="Upload images or paste Supabase public image URLs, one per line" rows={4} className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 border border-[#202024] text-xs text-[#b8b0a3] hover:text-[#c8a96a] hover:border-[#c8a96a] transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  {isUploadingImage ? 'Uploading...' : 'Upload image'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} disabled={isUploadingImage} />
                </label>
                {firstImage && (
                  <a href={firstImage} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-[#202024] text-xs text-[#b8b0a3] hover:text-[#c8a96a] hover:border-[#c8a96a] transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Preview first image
                  </a>
                )}
              </div>
              <p className="text-[10px] text-[#8a8175] leading-relaxed">Images upload to the public Supabase Storage bucket named products. First image becomes the main storefront image.</p>
            </div>
            <input value={draft.colors} onChange={(e) => updateDraft('colors', e.target.value)} placeholder="Colors comma separated" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <input value={draft.materials} onChange={(e) => updateDraft('materials', e.target.value)} placeholder="Materials comma separated" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <input value={draft.tags} onChange={(e) => updateDraft('tags', e.target.value)} placeholder="Tags comma separated" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] sm:col-span-2" />
            <select value={draft.status} onChange={(e) => updateDraft('status', e.target.value as ProductDraft['status'])} className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="hidden">Hidden</option>
              <option value="archived">Archived</option>
              <option value="sold_out">Sold Out</option>
            </select>
            <input value={draft.sizes} onChange={(e) => updateDraft('sizes', e.target.value)} placeholder="Sizes e.g. S:10, M:8, L:4" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <input value={draft.fit} onChange={(e) => updateDraft('fit', e.target.value)} placeholder="Fit e.g. Oversized fit" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <input value={draft.careInstructions} onChange={(e) => updateDraft('careInstructions', e.target.value)} placeholder="Care instructions" className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8]" />
            <textarea value={draft.description} onChange={(e) => updateDraft('description', e.target.value)} placeholder="Description" rows={4} className="bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] sm:col-span-2" />
          </div>
          <div className="grid sm:grid-cols-4 gap-3 my-6">
            {productFlagFields.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 text-xs text-[#b8b0a3]">
                <input type="checkbox" checked={draft[key]} onChange={(e) => updateDraft(key, e.target.checked)} />
                {label}
              </label>
            ))}
          </div>
          <div className="flex gap-4">
            <button onClick={() => setMode('list')} className="nexora-button">Cancel</button>
            <button onClick={saveProduct} className="nexora-button-primary">{mode === 'create' ? 'Create Product' : 'Save Changes'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
