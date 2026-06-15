// ============================================================
// NEXORA — Cart Page
// ============================================================

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';
import SectionReveal from '@/components/ui/SectionReveal';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { trackEvent } from '@/services/analytics.service';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const subtotal = getTotalPrice();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  useEffect(() => {
    void trackEvent('cart_view', { itemsCount: items.length, subtotal });
  }, [items.length, subtotal]);

  if (items.length === 0) {
    return (
      <>
        <Helmet><title>Cart | NEXORA</title></Helmet>
        <div className="pt-32 pb-20 min-h-screen bg-[#050505]">
          <EmptyState type="cart" />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet><title>Cart | NEXORA</title></Helmet>
      <div className="pt-24 pb-20 bg-[#050505] min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <p className="nexora-caption text-[#c8a96a] mb-3">Shopping Cart</p>
            <h1 className="nexora-heading-md mb-10">YOUR CART</h1>
          </SectionReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, i) => (
                <motion.div
                  key={`${item.productId}-${item.size}-${item.color || 'default'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 p-4 bg-[#0b0b0d] border border-[#17171a]"
                >
                  <Link to={`/product/${item.slug}`} className="w-24 h-24 flex-shrink-0 overflow-hidden bg-[#050505]">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`} className="text-sm font-semibold text-[#f4f0e8] hover:text-[#c8a96a] transition-colors block truncate">
                      {item.name}
                    </Link>
                    <div className="mt-1 space-y-1 text-xs text-[#8a8175]"><p>Size: {item.size}</p>{item.color && <p className="flex items-center gap-2">Color: <span className="inline-flex h-3 w-3 rounded-full border border-white/20" style={{ background: item.colorHex || undefined, backgroundImage: item.colorPattern || undefined }} /> {item.color}</p>}</div>
                    <p className="text-sm font-bold text-[#c8a96a] mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-0">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1, item.color)}
                          className="w-7 h-7 flex items-center justify-center border border-[#202024] text-[#b8b0a3] hover:border-[#6f675d]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 h-7 flex items-center justify-center border-t border-b border-[#202024] text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1, item.color)}
                          className="w-7 h-7 flex items-center justify-center border border-[#202024] text-[#b8b0a3] hover:border-[#6f675d]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size, item.color)}
                        className="p-1.5 text-[#8a8175] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <button
                onClick={clearCart}
                className="text-xs text-[#8a8175] hover:text-red-400 transition-colors tracking-wider uppercase"
              >
                Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="p-6 bg-[#0b0b0d] border border-[#17171a] sticky top-24">
                <h2 className="text-sm font-bold tracking-wider uppercase text-[#f4f0e8] mb-6">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#b8b0a3]">Subtotal</span>
                    <span className="text-[#f4f0e8]">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#b8b0a3]">Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400' : 'text-[#f4f0e8]'}>
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-[10px] text-[#8a8175]">
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                    </p>
                  )}
                  <div className="h-px bg-[#17171a]" />
                  <div className="flex justify-between">
                    <span className="text-sm font-bold">Total</span>
                    <span className="text-lg font-bold text-[#c8a96a]">{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full nexora-button-primary flex items-center justify-center gap-2 py-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <Link
                  to="/shop"
                  className="mt-3 flex items-center justify-center gap-2 text-xs text-[#b8b0a3] hover:text-[#c8a96a] transition-colors tracking-wider uppercase"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
