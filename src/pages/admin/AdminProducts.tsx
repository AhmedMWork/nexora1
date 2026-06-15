import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Eye, GripVertical, Plus, RefreshCw, Trash2, Upload, X, Star as StarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { PRODUCT_COLORS, PRODUCT_SIZES } from '@/lib/constants';
import { colorToStorage, normalizeColors } from '@/lib/productOptions';
import { formatPrice, generateSlug } from '@/lib/utils';
import { uploadProductImage } from '@/services/upload.service';
import type { Product, ProductColor } from '@/types';

type ProductFormMode = 'list' | 'create' | 'edit';
type CategoryChoice = 'men' | 'women' | 'unisex' | 'custom';

type ProductDraft = {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: CategoryChoice;
  customCategory: string;
  productType: string;
  collection: string;
  imageUrls: string[];
  colors: ProductColor[];
  customColorName: string;
  customColorHex: string;
  customColorPattern: string;
  materials: string;
  sku: string;
  tags: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  isLimitedDrop: boolean;
  status: Product['status'];
  sizes: Record<string, number>;
  fit: string;
  careInstructions: string;
};

const productTypes = ['T-Shirts', 'Hoodies', 'Sweatshirts', 'Pants', 'Shorts', 'Jackets', 'Accessories', 'Custom'];
const fitOptions = ['Regular fit', 'Oversized fit', 'Relaxed fit', 'Slim fit', 'Custom fit'];

const emptyDraft: ProductDraft = {
  name: '',
  slug: '',
  description: '',
  price: 0,
  category: 'unisex',
  customCategory: '',
  productType: 'T-Shirts',
  collection: 'core',
  imageUrls: [],
  colors: [{ id: 'black', name: 'Black', nameEn: 'Black', nameAr: 'أسود', hex: '#0E0B0A', available: true }],
  customColorName: '',
  customColorHex: '#D2B48C',
  customColorPattern: '',
  materials: 'Premium Cotton Blend',
  sku: '',
  tags: 'premium, essentials',
  isFeatured: false,
  isNewArrival: true,
  isBestSeller: false,
  isLimitedDrop: false,
  status: 'active',
  sizes: { S: 10, M: 10, L: 10, XL: 10 },
  fit: 'Regular fit',
  careInstructions: 'Wash inside out with similar colors. Do not bleach.',
};

const flagFields = [
  ['isFeatured', 'Featured', 'Show on the homepage featured products section.'],
  ['isNewArrival', 'New Arrival', 'Mark as a new product.'],
  ['isBestSeller', 'Best Seller', 'Use for products you want to highlight as best sellers.'],
  ['isLimitedDrop', 'Limited Drop', 'Use only for pieces connected to a live limited release.'],
] as const;

function Field({ label, help, children }: { label: string; help: string; children: React.ReactNode }) {
  return <div className="studio-field"><label>{label}</label>{children}<p className="studio-help">{help}</p></div>;
}

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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void loadCatalog(); }, []);

  const filteredProducts = useMemo(() => products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  ), [products, searchQuery]);

  const updateDraft = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const openCreate = () => {
    setEditingProduct(null);
    setDraft(emptyDraft);
    setMode('create');
  };

  const openEdit = (product: Product) => {
    const stock: Record<string, number> = {};
    product.sizes.forEach((size) => { stock[size.size] = size.stock; });
    setEditingProduct(product);
    setDraft({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      category: product.category,
      customCategory: '',
      productType: product.tags.find((tag) => productTypes.includes(tag)) || 'T-Shirts',
      collection: product.collection || 'core',
      imageUrls: product.images || [],
      colors: normalizeColors(product.colors),
      customColorName: '',
      customColorHex: '#D2B48C',
      customColorPattern: '',
      materials: product.materials.join(', '),
      sku: product.sku,
      tags: product.tags.join(', '),
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      isBestSeller: product.isBestSeller,
      isLimitedDrop: product.isLimitedDrop,
      status: product.status || 'active',
      sizes: Object.keys(stock).length ? stock : emptyDraft.sizes,
      fit: product.fit || 'Regular fit',
      careInstructions: product.careInstructions || emptyDraft.careInstructions,
    });
    setMode('edit');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Archive this product? It will disappear from the storefront.')) return;
    try {
      const { deleteProduct } = await import('@/lib/supabase/db');
      await deleteProduct(id);
      setProducts((current) => current.filter((p) => p.id !== id));
      toast.success('Product archived');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not archive product');
    }
  };

  const handleImageUpload = async (file?: File | null) => {
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const url = await uploadProductImage(file, draft.slug || generateSlug(draft.name || 'product'));
      setDraft((current) => ({ ...current, imageUrls: [...current.imageUrls, url] }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const saveProduct = async () => {
    const imageList = draft.imageUrls.map((v) => v.trim()).filter(Boolean);
    if (!draft.name.trim() || !draft.price || !draft.sku.trim() || imageList.length === 0) {
      toast.error('Name, price, SKU, and at least one image are required');
      return;
    }

    const sizeRows = Object.entries(draft.sizes)
      .filter(([, stock]) => Number(stock) >= 0)
      .map(([size, stock]) => ({ size, stock: Number(stock), lowStockThreshold: 3 }));

    const category = draft.category === 'custom' ? 'unisex' : draft.category;
    const customTags = draft.tags.split(',').map((v) => v.trim()).filter(Boolean);
    const payload = {
      name: draft.name.trim(),
      slug: draft.slug || generateSlug(draft.name),
      description: draft.description || `${draft.name} by NEXORA.`,
      price: Number(draft.price),
      compareAtPrice: draft.compareAtPrice ? Number(draft.compareAtPrice) : undefined,
      category,
      gender: category,
      collection: draft.category === 'custom' && draft.customCategory ? draft.customCategory : draft.collection || 'core',
      images: imageList,
      thumbnail: imageList[0],
      sizes: sizeRows,
      colors: draft.colors.map(colorToStorage),
      materials: draft.materials.split(',').map((v) => v.trim()).filter(Boolean),
      sku: draft.sku.trim(),
      tags: [...new Set([draft.productType, ...customTags].filter(Boolean))],
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
      seoDescription: (draft.description || `${draft.name} by NEXORA`).slice(0, 155),
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
      void loadCatalog();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not save product');
    }
  };

  const moveImage = (from: number, to: number) => {
    setDraft((current) => {
      const next = [...current.imageUrls];
      const [item] = next.splice(from, 1);
      if (!item) return current;
      next.splice(to, 0, item);
      return { ...current, imageUrls: next };
    });
  };

  const removeImage = (url: string) => setDraft((current) => ({ ...current, imageUrls: current.imageUrls.filter((img) => img !== url) }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#FFF0E1]">Products</h1>
          <p className="mt-1 text-sm text-[#BCAEA0]">Create, edit, publish, and manage images for NEXORA products.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadCatalog} className="nexora-button"><RefreshCw className="h-4 w-4" />Refresh</button>
          <button onClick={openCreate} className="nexora-button-primary"><Plus className="h-4 w-4" />Add Product</button>
        </div>
      </div>

      {mode === 'list' && (
        <>
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by product name or SKU" className="studio-input" />
          <div className="studio-card overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead><tr className="border-b border-[#4A3D37]">
                {['Image', 'Name', 'SKU', 'Price', 'Stock', 'Category', 'Actions'].map((h) => <th key={h} className="p-4 text-[10px] font-bold uppercase tracking-wider text-[#BCAEA0]">{h}</th>)}
              </tr></thead>
              <tbody>
                {isLoading ? <tr><td colSpan={7} className="p-8 text-center text-sm text-[#BCAEA0]">Loading products...</td></tr> : filteredProducts.map((product) => {
                  const totalStock = product.sizes.reduce((sum, size) => sum + size.stock, 0);
                  return <tr key={product.id} className="border-b border-[#332923] transition-colors hover:bg-[#2B211D]">
                    <td className="p-4"><img src={product.images[0] || '/assets/nexora-logo-bg.jpg'} alt={product.name} className="h-12 w-12 rounded-xl object-cover" /></td>
                    <td className="p-4"><Link to={`/product/${product.slug}`} className="text-sm font-semibold text-[#FFF0E1] hover:text-[#D2B48C]">{product.name}</Link><p className="text-[10px] uppercase tracking-wider text-[#BCAEA0]">{product.status}</p></td>
                    <td className="p-4 text-xs text-[#BCAEA0]">{product.sku}</td>
                    <td className="p-4 text-xs font-semibold text-[#D2B48C]">{formatPrice(product.price)}</td>
                    <td className="p-4 text-xs text-[#BCAEA0]">{totalStock} units</td>
                    <td className="p-4 text-xs text-[#BCAEA0]">{product.category}</td>
                    <td className="p-4"><div className="flex gap-2"><button onClick={() => openEdit(product)} className="text-[#BCAEA0] hover:text-[#D2B48C]"><Edit className="h-4 w-4" /></button><Link to={`/nexora-admin/reviews?productId=${product.id}`} className="text-[#BCAEA0] hover:text-[#D2B48C]" title="Manage product reviews"><StarIcon className="h-4 w-4" /></Link><button onClick={() => handleDelete(product.id)} className="text-[#BCAEA0] hover:text-red-300"><Trash2 className="h-4 w-4" /></button></div></td>
                  </tr>;
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <div className="studio-card p-5 sm:p-7">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[#FFF0E1]">{mode === 'create' ? 'Add New Product' : 'Edit Product'}</h2>
              <p className="mt-1 text-sm text-[#BCAEA0]">Fields include helper notes so you can manage the store without studying the code.</p>
            </div>
            <button onClick={() => setMode('list')} className="text-[#BCAEA0] hover:text-[#FFF0E1]"><X className="h-5 w-5" /></button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Product name" help="The name customers will see. Example: NEXORA Signature Tee."><input value={draft.name} onChange={(e) => updateDraft('name', e.target.value)} className="studio-input" /></Field>
            <Field label="Slug" help="Leave empty to auto-generate. Used in the product page URL."><input value={draft.slug} onChange={(e) => updateDraft('slug', e.target.value)} className="studio-input" placeholder="auto if empty" /></Field>
            <Field label="Price EGP" help="Selling price in Egyptian pounds. Example: 499."><input type="number" value={draft.price} onChange={(e) => updateDraft('price', Number(e.target.value))} className="studio-input" /></Field>
            <Field label="Compare-at price" help="Optional old price shown crossed out. Leave empty if not needed."><input type="number" value={draft.compareAtPrice || ''} onChange={(e) => updateDraft('compareAtPrice', e.target.value ? Number(e.target.value) : undefined)} className="studio-input" /></Field>
            <Field label="Gender" help="Most products should be Men, Women, or Unisex. Use Custom only for special collections."><select value={draft.category} onChange={(e) => updateDraft('category', e.target.value as CategoryChoice)} className="studio-input"><option value="men">Men</option><option value="women">Women</option><option value="unisex">Unisex</option><option value="custom">Custom</option></select></Field>
            <Field label="Product type" help="Choose a type to keep the catalog organized."><select value={draft.productType} onChange={(e) => updateDraft('productType', e.target.value)} className="studio-input">{productTypes.map((type) => <option key={type}>{type}</option>)}</select></Field>
            {draft.category === 'custom' && <Field label="Custom category" help="Used internally if the product does not fit Men/Women/Unisex."><input value={draft.customCategory} onChange={(e) => updateDraft('customCategory', e.target.value)} className="studio-input" /></Field>}
            <Field label="SKU" help="Internal stock code. Example: NXR-TEE-001."><input value={draft.sku} onChange={(e) => updateDraft('sku', e.target.value)} className="studio-input" /></Field>
            <Field label="Collection" help="Internal collection name like core, summer, or limited."><input value={draft.collection} onChange={(e) => updateDraft('collection', e.target.value)} className="studio-input" /></Field>
            <Field label="Fit" help="Choose the fit customers should expect."><select value={draft.fit} onChange={(e) => updateDraft('fit', e.target.value)} className="studio-input">{fitOptions.map((fit) => <option key={fit}>{fit}</option>)}</select></Field>
            <Field label="Materials" help="Separate materials with commas. Example: Premium cotton, soft rib."><input value={draft.materials} onChange={(e) => updateDraft('materials', e.target.value)} className="studio-input" /></Field>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <Field label="Colors" help="Customers will select one of these colors before adding to cart. Choose from the palette or add a custom HEX/pattern.">
              <div className="flex flex-wrap gap-2">
                {PRODUCT_COLORS.filter((color) => color.value !== 'custom').map((color) => {
                  const active = draft.colors.some((selected) => selected.id === color.value);
                  const storedColor: ProductColor = { id: color.value, name: color.label, nameEn: color.label, nameAr: color.labelAr, hex: color.hex, available: true };
                  return <button key={color.value} type="button" data-active={active} className="studio-chip" onClick={() => updateDraft('colors', active ? draft.colors.filter((c) => c.id !== color.value) : [...draft.colors, storedColor])}><span className="h-3 w-3 rounded-full border border-white/20" style={{ background: color.hex }} />{color.label}</button>;
                })}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_130px]">
                <input value={draft.customColorName} onChange={(e) => updateDraft('customColorName', e.target.value)} className="studio-input" placeholder="Custom color name, e.g. Cocoa Stripe" />
                <input type="color" value={draft.customColorHex} onChange={(e) => updateDraft('customColorHex', e.target.value)} className="h-[48px] w-full cursor-pointer rounded-2xl border border-[#3A4152] bg-[#12151B] p-2" aria-label="Custom color HEX" />
              </div>
              <input value={draft.customColorPattern} onChange={(e) => updateDraft('customColorPattern', e.target.value)} className="studio-input mt-3" placeholder="Optional CSS pattern/gradient. Example: linear-gradient(45deg,#111,#fff)" />
              <button type="button" className="nexora-button mt-3" onClick={() => {
                const name = draft.customColorName.trim();
                if (!name) return toast.error('Write a custom color name first');
                const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                if (draft.colors.some((c) => c.id === id)) return toast.error('Color already added');
                updateDraft('colors', [...draft.colors, { id, name, nameEn: name, hex: draft.customColorHex, pattern: draft.customColorPattern || undefined, available: true }]);
                updateDraft('customColorName', '');
                updateDraft('customColorPattern', '');
              }}>Add custom color</button>
              {draft.colors.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{draft.colors.map((color) => <span key={color.id} className="studio-chip" data-active="true"><span className="h-3 w-3 rounded-full border border-white/20" style={{ background: color.hex, backgroundImage: color.pattern }} />{color.name}<button type="button" onClick={() => updateDraft('colors', draft.colors.filter((c) => c.id !== color.id))} className="ml-1 text-red-200">×</button></span>)}</div>}
            </Field>

            <Field label="Sizes and stock" help="Set stock for each size. Put 0 if unavailable.">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {PRODUCT_SIZES.map((size) => <label key={size} className="rounded-2xl border border-[#5B473C] bg-[#0E0B0A] p-2 text-center text-xs text-[#F4E8DA]"><span className="mb-1 block font-bold">{size}</span><input type="number" min={0} value={draft.sizes[size] ?? 0} onChange={(e) => updateDraft('sizes', { ...draft.sizes, [size]: Number(e.target.value) })} className="w-full rounded-xl border border-[#332923] bg-[#17110F] px-2 py-1 text-center text-xs" /></label>)}
              </div>
            </Field>
          </div>

          <div className="mt-7">
            <Field label="Images gallery" help="Upload multiple images. The first image is the main product image. Use arrows to reorder.">
              <div className="mb-4 flex flex-wrap gap-2">
                <label className="nexora-button cursor-pointer">
                  <Upload className="h-4 w-4" /> {isUploadingImage ? 'Uploading...' : 'Upload image'}
                  <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} disabled={isUploadingImage} />
                </label>
                <input className="studio-input max-w-xl" placeholder="Paste image URL then press Enter" onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); const value = e.currentTarget.value.trim(); if (value) { updateDraft('imageUrls', [...draft.imageUrls, value]); e.currentTarget.value = ''; } } }} />
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {draft.imageUrls.map((url, index) => <div key={`${url}-${index}`} className="relative rounded-2xl border border-[#5B473C] bg-[#0E0B0A] p-2"><img src={url} alt={`Product ${index + 1}`} className="h-32 w-full rounded-xl object-cover" /><div className="mt-2 flex items-center justify-between gap-2"><span className="text-[10px] text-[#BCAEA0]">{index === 0 ? 'Main' : `Image ${index + 1}`}</span><div className="flex gap-1"><button onClick={() => index > 0 && moveImage(index, index - 1)} className="text-[#BCAEA0]"><GripVertical className="h-3 w-3" /></button><a href={url} target="_blank" rel="noreferrer" className="text-[#BCAEA0]"><Eye className="h-3 w-3" /></a><button onClick={() => removeImage(url)} className="text-red-300"><X className="h-3 w-3" /></button></div></div></div>)}
              </div>
            </Field>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <Field label="Tags" help="Optional tags separated by commas for filtering and search."><input value={draft.tags} onChange={(e) => updateDraft('tags', e.target.value)} className="studio-input" /></Field>
            <Field label="Status" help="Active appears in the store. Draft/Hidden stay private. Sold Out appears unavailable."><select value={draft.status} onChange={(e) => updateDraft('status', e.target.value as ProductDraft['status'])} className="studio-input"><option value="draft">Draft</option><option value="active">Active</option><option value="hidden">Hidden</option><option value="archived">Archived</option><option value="sold_out">Sold Out</option></select></Field>
            <Field label="Care instructions" help="Short washing/care note for the customer."><input value={draft.careInstructions} onChange={(e) => updateDraft('careInstructions', e.target.value)} className="studio-input" /></Field>
            <Field label="Description" help="Clear customer-facing description. Avoid internal notes."><textarea value={draft.description} onChange={(e) => updateDraft('description', e.target.value)} rows={5} className="studio-input" /></Field>
          </div>

          <div className="my-7 grid gap-3 md:grid-cols-4">
            {flagFields.map(([key, label, help]) => <button key={key} type="button" data-active={draft[key]} className="studio-chip justify-center rounded-2xl px-4 py-3 text-left" onClick={() => updateDraft(key, !draft[key])}><span>{label}</span><span className="sr-only">{help}</span></button>)}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={() => setMode('list')} className="nexora-button">Cancel</button>
            <button onClick={saveProduct} className="nexora-button-primary">{mode === 'create' ? 'Create Product' : 'Save Changes'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
