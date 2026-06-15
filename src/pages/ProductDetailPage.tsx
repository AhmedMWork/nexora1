// ============================================================
// NEXORA — Product Detail Page (PDP)
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Minus,
  Plus,
  Star,
  MessageSquare,
} from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { useRecentlyViewedStore } from '@/stores/recentlyViewedStore';
import { loadProductBySlug, loadProducts } from '@/services/productService';
import type { Product, Review } from '@/types';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import ProductCard from '@/components/ui/ProductCard';
import SectionReveal from '@/components/ui/SectionReveal';
import toast from 'react-hot-toast';
import { trackEvent } from '@/services/analytics.service';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'description' | 'shipping' | 'reviews'>('description');

  const { isInWishlist, toggleItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.addProduct);

  useEffect(() => {
    let mounted = true;
    if (!slug) return;
    setIsLoading(true);
    loadProductBySlug(slug)
      .then(async (loadedProduct) => {
        if (!mounted) return;
        setProduct(loadedProduct);
        if (loadedProduct) {
          const products = await loadProducts({ category: loadedProduct.category });
          if (mounted) {
            setRelatedProducts(products.filter((p) => p.slug !== loadedProduct.slug).slice(0, 4));
          }
          const { getReviews } = await import('@/lib/supabase/db');
          const loadedReviews = await getReviews({ productId: loadedProduct.id, isApproved: true });
          if (mounted) setReviews(loadedReviews);
          void trackEvent('product_view', { productId: loadedProduct.id, productName: loadedProduct.name, slug: loadedProduct.slug });
        } else {
          setRelatedProducts([]);
          setReviews([]);
        }
      })
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => {
    if (slug) {
      addRecentlyViewed(slug);
    }
  }, [slug, addRecentlyViewed]);

  useEffect(() => {
    setSelectedSize('');
    setQuantity(1);
    setActiveImage(0);
    window.scrollTo(0, 0);
  }, [slug]);

  if (isLoading) {
    return (
      <div className="pt-32 pb-20 bg-[#050505] min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-7 gap-8 lg:gap-12">
            <div className="lg:col-span-4 aspect-[3/4] bg-[#0b0b0d] skeleton-pulse" />
            <div className="lg:col-span-3 space-y-4">
              <div className="h-4 w-32 bg-[#0b0b0d] skeleton-pulse" />
              <div className="h-10 w-3/4 bg-[#0b0b0d] skeleton-pulse" />
              <div className="h-8 w-40 bg-[#0b0b0d] skeleton-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center bg-[#050505] min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-[#f4f0e8]">Product Not Found</h1>
        <Link to="/shop" className="nexora-button">Back to Shop</Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.price, product.compareAtPrice);
  const inWishlist = isInWishlist(product.id);
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    const sizeData = product.sizes.find((s) => s.size === selectedSize);
    if (!sizeData || sizeData.stock < quantity) {
      toast.error('Not enough stock');
      return;
    }
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      image: product.images[activeImage] || product.images[0],
    });
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    toggleItem(product.id);
    toast(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      icon: inWishlist ? '💔' : '❤️',
    });
  };

  return (
    <>
      <Helmet>
        <title>{product.seoTitle}</title>
        <meta name="description" content={product.seoDescription} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description.slice(0, 160)} />
        <meta property="og:type" content="product" />
        <meta property="og:image" content={product.images[0]} />
        <meta property="product:price:amount" content={String(product.price)} />
        <meta property="product:price:currency" content="EGP" />
        <link rel="canonical" href={`/product/${product.slug}`} />
      </Helmet>

      <div className="pt-24 pb-20 bg-[#050505] min-h-screen">
        {/* Breadcrumb */}
        <div className="w-full px-4 sm:px-6 lg:px-10 mb-8">
          <div className="flex items-center gap-2 text-[10px] text-[#8a8175] uppercase tracking-wider">
            <Link to="/" className="hover:text-[#b8b0a3] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to="/shop" className="hover:text-[#b8b0a3] transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/shop/${product.category}`} className="hover:text-[#b8b0a3] transition-colors capitalize">
              {product.category}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#b8b0a3]">{product.name}</span>
          </div>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-7 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-[3/4] bg-[#0b0b0d] overflow-hidden"
              >
                <img
                  src={product.images[activeImage] || product.images[0] || '/assets/nexora-logo-bg.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-[#c8a96a] text-[#050505] text-[10px] font-bold px-3 py-1.5 tracking-wider uppercase">
                    Save {discount}%
                  </span>
                )}
              </motion.div>
              {product.images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button key={`${image}-${index}`} onClick={() => setActiveImage(index)} className={`aspect-square overflow-hidden border ${activeImage === index ? 'border-[#c8a96a]' : 'border-[#17171a]'} bg-[#0b0b0d]`}>
                      <img src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-[10px] tracking-[0.2em] uppercase text-[#c8a96a] mb-2">
                  {product.category} — {product.collection}
                </p>
                <h1 className="text-2xl lg:text-3xl font-bold text-[#f4f0e8] mb-3">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < Math.floor(product.rating)
                            ? 'text-[#c8a96a] fill-[#c8a96a]'
                            : 'text-[#2a2a2d]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#b8b0a3]">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#17171a]">
                  <span className="text-3xl font-bold text-[#f4f0e8]">
                    {formatPrice(product.price)}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-lg text-[#8a8175] line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                  )}
                </div>

                {/* Size Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium tracking-wider uppercase text-[#b8b0a3]">
                      Size
                    </span>
                    <span className="text-[10px] text-[#8a8175]">Choose available size</span>
                  </div>
                  <div className="flex gap-2">
                    {product.sizes.map((size) => {
                      const isAvailable = size.stock > 0;
                      const isSelected = selectedSize === size.size;
                      const isLowStock = size.stock <= size.lowStockThreshold && isAvailable;

                      return (
                        <button
                          key={size.size}
                          onClick={() => isAvailable && setSelectedSize(size.size)}
                          disabled={!isAvailable}
                          className={`relative w-11 h-11 flex items-center justify-center text-xs font-medium border transition-all ${
                            isSelected
                              ? 'border-[#c8a96a] text-[#c8a96a] bg-[#c8a96a]/5'
                              : isAvailable
                              ? 'border-[#202024] text-[#b8b0a3] hover:border-[#6f675d] hover:text-[#f4f0e8]'
                              : 'border-[#1a1a1a] text-[#2a2a2d] cursor-not-allowed'
                          }`}
                        >
                          {size.size}
                          {isLowStock && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#c8a96a] rounded-full" />
                          )}
                          {!isAvailable && (
                            <span className="absolute inset-0 flex items-center justify-center">
                              <span className="w-6 h-px bg-[#202024] rotate-45" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {selectedSize && (
                    <p className="text-[10px] text-[#8a8175] mt-2">
                      {product.sizes.find((s) => s.size === selectedSize)?.stock} units available
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <span className="text-xs font-medium tracking-wider uppercase text-[#b8b0a3] block mb-3">
                    Quantity
                  </span>
                  <div className="flex items-center gap-0">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-11 h-11 flex items-center justify-center border border-[#202024] text-[#b8b0a3] hover:border-[#6f675d] transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-14 h-11 flex items-center justify-center border-t border-b border-[#202024] text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.sizes.find((s) => s.size === selectedSize)?.stock || quantity + 1, quantity + 1))}
                      className="w-11 h-11 flex items-center justify-center border border-[#202024] text-[#b8b0a3] hover:border-[#6f675d] transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mb-8">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 nexora-button-primary flex items-center justify-center gap-2 py-4"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleWishlist}
                    className={`w-14 h-14 flex items-center justify-center border transition-all ${
                      inWishlist
                        ? 'border-[#c8a96a] bg-[#c8a96a]/5 text-[#c8a96a]'
                        : 'border-[#202024] text-[#b8b0a3] hover:border-[#6f675d]'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3 mb-8 pb-8 border-b border-[#17171a]">
                  {[
                    { icon: Truck, label: 'Fast Delivery' },
                    { icon: RotateCcw, label: 'Easy Returns' },
                    { icon: Shield, label: 'Secure Payment' },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 py-3">
                      <Icon className="w-4 h-4 text-[#8a8175]" />
                      <span className="text-[9px] text-[#8a8175] text-center uppercase tracking-wider">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/shop?tag=${tag}`}
                      className="text-[10px] px-2.5 py-1 bg-[#0b0b0d] text-[#8a8175] border border-[#17171a] hover:border-[#2a2a2d] hover:text-[#b8b0a3] transition-colors uppercase tracking-wider"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16 lg:mt-24">
            <div className="flex gap-0 border-b border-[#17171a] mb-8">
              {(['description', 'shipping', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-xs tracking-[0.15em] uppercase transition-colors border-b-2 ${
                    activeTab === tab
                      ? 'text-[#c8a96a] border-[#c8a96a]'
                      : 'text-[#8a8175] border-transparent hover:text-[#b8b0a3]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-sm text-[#b8b0a3] leading-relaxed max-w-2xl mb-6">
                  {product.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b8b0a3] mb-2">Materials</h4>
                    <ul className="space-y-1">
                      {product.materials.map((m) => (
                        <li key={m} className="text-xs text-[#8a8175]">{m}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#b8b0a3] mb-2">Colors</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map((c) => (
                        <span key={c} className="text-xs text-[#8a8175] capitalize">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'shipping' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
                <div className="space-y-4">
                  <div className="p-4 bg-[#0b0b0d] border border-[#17171a]">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-[#f4f0e8] mb-2">Delivery</h4>
                    <p className="text-xs text-[#b8b0a3] leading-relaxed">
                      We deliver across all Egyptian governorates. Orders typically arrive within 2-5 business days depending on your location. Cairo and Giza orders are usually delivered within 48 hours.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0b0b0d] border border-[#17171a]">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-[#f4f0e8] mb-2">Free Shipping</h4>
                    <p className="text-xs text-[#b8b0a3] leading-relaxed">
                      Enjoy free shipping on all orders over 1,500 EGP. Standard shipping fee is 60 EGP for orders below that threshold.
                    </p>
                  </div>
                  <div className="p-4 bg-[#0b0b0d] border border-[#17171a]">
                    <h4 className="text-xs font-bold tracking-wider uppercase text-[#f4f0e8] mb-2">Returns</h4>
                    <p className="text-xs text-[#b8b0a3] leading-relaxed">
                      Not satisfied? Return unused items with original tags within 14 days of delivery for a full refund or exchange. Return shipping is on us.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {reviews.length > 0 ? (
                  <div className="space-y-4 max-w-2xl">
                    {reviews.map((review, i) => (
                      <div key={i} className="p-5 bg-[#0b0b0d] border border-[#17171a]">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`w-3 h-3 ${j < review.rating ? 'text-[#c8a96a] fill-[#c8a96a]' : 'text-[#2a2a2d]'}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-[#b8b0a3]">{review.customerName}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#f4f0e8] mb-1">{review.title}</h4>
                        <p className="text-xs text-[#b8b0a3] leading-relaxed">{review.body}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <MessageSquare className="w-8 h-8 text-[#2a2a2d] mx-auto mb-3" />
                    <p className="text-sm text-[#8a8175]">No reviews yet. Be the first to review!</p>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-20">
              <SectionReveal>
                <h2 className="text-xl font-bold tracking-wider uppercase text-[#f4f0e8] mb-8">
                  You May Also Like
                </h2>
              </SectionReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.slug} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
