// ============================================================
// NEXORA — Midnight Atelier Product Card
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import type { Product } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const inWishlist = isInWishlist(product.id);
  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const availableSizes = product.sizes.filter((s) => s.stock > 0);
  const totalStock = product.sizes.reduce((sum, size) => sum + Math.max(0, size.stock), 0);
  const isSoldOut = product.status === 'sold_out' || totalStock <= 0;
  const isLowStock = !isSoldOut && totalStock <= 5;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = availableSizes[0]?.size;
    if (!defaultSize || isSoldOut) {
      toast.error('This piece is currently unavailable');
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: defaultSize,
      quantity: 1,
      image: product.images[0] || '',
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem(product.id);
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: inWishlist ? '💔' : '❤️',
    });
  };

  const badge = discount > 0
    ? `-${discount}%`
    : isSoldOut
      ? 'Sold Out'
      : isLowStock
        ? 'Low Stock'
        : product.isLimitedDrop
          ? 'Limited'
          : product.isNewArrival
            ? 'New'
            : product.isBestSeller
              ? 'Best Seller'
              : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '80px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.25) }}
      className="h-full"
    >
      <Link
        to={`/product/${product.slug}`}
        className="v3-product-card group block h-full border transition-all duration-500"
      >
        <div className="v3-product-media relative aspect-[3/4] overflow-hidden">
          <img
            src={product.images[0] || product.thumbnail || '/assets/nexora-logo-bg.jpg'}
            alt={product.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045] ${isSoldOut ? 'grayscale opacity-60' : 'opacity-95'}`}
          />
          <div className="v3-product-grad absolute inset-0 opacity-80" />

          {badge && (
            <span className={`absolute top-3 left-3 border px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.18em] backdrop-blur-xl ${
              isSoldOut
                ? 'border-[#8a8175]/30 bg-[#050505]/70 text-[#b8b0a3]'
                : discount > 0
                  ? 'border-[var(--v33-accent)] bg-[var(--v33-accent)] text-[var(--v33-text)]'
                  : 'border-[var(--v33-accent)] bg-[color-mix(in_srgb,var(--v33-card)_72%,transparent)] text-[var(--v33-accent-strong)]'
            }`}>
              {badge}
            </span>
          )}

          <button
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2.5 transition-all duration-300 ${
              inWishlist
                ? 'bg-[var(--v33-accent)] text-[var(--v33-text)]'
                : 'bg-[color-mix(in_srgb,var(--v33-card)_72%,transparent)] text-[var(--v33-text)] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-[var(--v33-accent-strong)]'
            }`}
            aria-label="Toggle wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          <div className="absolute bottom-0 left-0 right-0 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              disabled={isSoldOut}
              className="w-full py-3.5 bg-[var(--v33-accent)] text-[var(--v33-text)] text-[10px] font-black tracking-[0.22em] uppercase flex items-center justify-center gap-2 hover:bg-[var(--v33-accent-strong)] hover:text-[#FFFDF8] transition-colors disabled:bg-[#17171a] disabled:text-[var(--v33-muted)]"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {isSoldOut ? 'Unavailable' : 'Quick Add'}
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[var(--v33-muted)]">
            {product.category} · {product.collection}
          </p>
          <h3 className="mb-3 line-clamp-1 text-sm font-bold text-[var(--v33-text)] transition-colors group-hover:text-[var(--v33-accent-strong)]">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[var(--v33-text)]">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs text-[var(--v33-muted)] line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            {isLowStock && (
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--v33-accent-strong)]">
                {totalStock} left
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
