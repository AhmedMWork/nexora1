// ============================================================
// NEXORA — Admin Inventory Page
// ============================================================

import { useEffect, useState } from 'react';
import { AlertTriangle, Plus, Minus, RefreshCw } from 'lucide-react';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const { loadProducts } = await import('@/services/productService');
      setProducts(await loadProducts());
    } catch {
      toast.error('Could not load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const adjustStock = async (productId: string, size: string, delta: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const updatedSizes = product.sizes.map((s) =>
      s.size === size ? { ...s, stock: Math.max(0, s.stock + delta) } : s
    );

    setProducts(products.map((p) => p.id === productId ? { ...p, sizes: updatedSizes } : p));

    try {
      const { updateProduct } = await import('@/lib/supabase/db');
      await updateProduct(productId, { sizes: updatedSizes });
      toast.success('Stock updated');
    } catch {
      toast.error('Could not save stock update');
      loadInventory();
    }
  };

  const lowStockItems = products.filter((p) => p.sizes.some((s) => s.stock <= s.lowStockThreshold));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-wider uppercase text-[#f4f0e8]">Inventory</h1>
          <p className="text-xs text-[#8a8175] mt-1">Manage product stock levels</p>
        </div>
        <button onClick={loadInventory} className="nexora-button flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="p-4 bg-red-500/5 border border-red-500/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Low Stock Alert</span>
          </div>
          <div className="space-y-1">
            {lowStockItems.map((p) => (
              <p key={p.id} className="text-xs text-[#b8b0a3]">{p.name}: {p.sizes.filter((s) => s.stock <= s.lowStockThreshold).map((s) => `${s.size} (${s.stock})`).join(', ')}</p>
            ))}
          </div>
        </div>
      )}

      <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#0b0b0d] border border-[#202024] px-4 py-2.5 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a]" />

      <div className="bg-[#0b0b0d] border border-[#17171a] overflow-x-auto">
        <table className="w-full text-left min-w-[720px]">
          <thead>
            <tr className="border-b border-[#17171a]">
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Product</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">SKU</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Sizes & Stock</th>
              <th className="p-4 text-[10px] font-medium text-[#8a8175] uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={4} className="p-8 text-center text-xs text-[#8a8175]">Loading inventory...</td></tr>
            ) : filteredProducts.map((product) => {
              const totalStock = product.sizes.reduce((sum, s) => sum + s.stock, 0);
              return (
                <tr key={product.id} className="border-b border-[#17171a]/50">
                  <td className="p-4"><div className="flex items-center gap-3"><img src={product.images[0]} alt={product.name} className="w-8 h-8 object-cover bg-[#050505]" /><span className="text-xs text-[#f4f0e8]">{product.name}</span></div></td>
                  <td className="p-4 text-xs text-[#b8b0a3]">{product.sku}</td>
                  <td className="p-4"><div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <div key={size.size} className="flex items-center gap-1">
                        <span className={`text-[10px] px-2 py-1 border ${size.stock <= size.lowStockThreshold ? 'border-red-400/30 text-red-400 bg-red-400/5' : 'border-[#202024] text-[#b8b0a3]'}`}>{size.size}: {size.stock}</span>
                        <button onClick={() => adjustStock(product.id, size.size, -1)} className="p-0.5 text-[#8a8175] hover:text-red-400"><Minus className="w-3 h-3" /></button>
                        <button onClick={() => adjustStock(product.id, size.size, 1)} className="p-0.5 text-[#8a8175] hover:text-green-400"><Plus className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div></td>
                  <td className="p-4"><span className={`text-xs font-medium ${totalStock <= 10 ? 'text-red-400' : 'text-[#b8b0a3]'}`}>{totalStock}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
