// ============================================================
// NEXORA — Checkout Page
// ============================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Banknote, Shield, CheckCircle, Copy, Smartphone } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { checkoutSchema, type CheckoutFormData } from '@/lib/validators';
import { getGovernorateNames, getCitiesForGovernorate, generateWhatsAppLink } from '@/lib/egyptData';
import { formatPrice, generateOrderNumber } from '@/lib/utils';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import SectionReveal from '@/components/ui/SectionReveal';
import EmptyState from '@/components/ui/EmptyState';
import { useI18n } from '@/i18n/I18nProvider';
import toast from 'react-hot-toast';

const DEFAULT_WHATSAPP = import.meta.env.VITE_DEFAULT_WHATSAPP_NUMBER || '';

export default function CheckoutPage() {
  const { t } = useI18n();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedGovernorate, setSelectedGovernorate] = useState('');
  const [whatsAppNumber, setWhatsAppNumber] = useState(DEFAULT_WHATSAPP);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; freeShipping?: boolean } | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);

  const subtotal = getTotalPrice();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || appliedCoupon?.freeShipping ? 0 : SHIPPING_FEE;
  const discount = appliedCoupon?.discount || 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: 'cod' },
  });

  const watchedGovernorate = watch('governorate');
  const cities = selectedGovernorate ? getCitiesForGovernorate(selectedGovernorate) : [];

  useEffect(() => {
    let mounted = true;
    import('@/lib/supabase/db')
      .then(({ getSiteSettings }) => getSiteSettings())
      .then((settings) => {
        if (mounted && settings?.whatsappNumber) setWhatsAppNumber(settings.whatsappNumber);
      })
      .catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsCheckingCoupon(true);
    try {
      const { validateCouponForCart } = await import('@/lib/supabase/db');
      const result = await validateCouponForCart({
        code: couponCode,
        subtotal,
        items: items.map((item) => ({ productId: item.productId, size: item.size, quantity: item.quantity })),
      });
      if (!result.valid) {
        setAppliedCoupon(null);
        toast.error(result.message);
        return;
      }
      setAppliedCoupon({ code: result.code || couponCode.toUpperCase(), discount: result.discount, freeShipping: result.freeShipping });
      toast.success(result.message);
    } catch {
      toast.error('Could not validate this code');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const onSubmit = async (data: CheckoutFormData) => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const { createOrderWithStockTransaction } = await import('@/lib/supabase/db');
      const newOrderNumber = generateOrderNumber();

      const createdOrder = await createOrderWithStockTransaction({
        orderNumber: newOrderNumber,
        customer: {
          fullName: data.fullName,
          phone: data.phone,
          governorate: data.governorate,
          city: data.city,
          address: data.address,
          notes: data.notes,
        },
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          slug: item.slug,
          price: item.price,
          size: item.size,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        shippingFee: shipping,
        discount,
        couponCode: appliedCoupon?.code,
        total,
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        status: 'pending',
        trackingUpdates: [
          {
            status: 'pending',
            message: 'Order received. Awaiting confirmation.',
            timestamp: new Date(),
            updatedBy: 'system',
          },
        ],
      });

      setOrderNumber(createdOrder.orderNumber || newOrderNumber);
      setOrderComplete(true);
      clearCart();
      toast.success(t('checkout.confirmed'));
    } catch (error) {
      const message = error instanceof Error ? error.message : t('checkout.failed');
      toast.error(message || t('checkout.failed'));
    }
  };

  if (items.length === 0 && !orderComplete) {
    return (
      <>
        <Helmet><title>{t('checkout.title')} | NEXORA</title></Helmet>
        <div className="pt-32 pb-20 min-h-screen bg-[#050505]">
          <EmptyState type="cart" />
        </div>
      </>
    );
  }

  if (orderComplete) {
    const whatsappMessage = `Hello NEXORA! I just placed an order with cash on delivery. My order number is: ${orderNumber}`;
    return (
      <div className="pt-32 pb-20 min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 flex items-center justify-center bg-[#c8a96a]/10 border border-[#c8a96a]/20 mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#c8a96a]" />
          </div>
          <h1 className="text-2xl font-bold text-[#f4f0e8] mb-3">{t('checkout.confirmed')}</h1>
          <p className="text-sm text-[#b8b0a3] mb-6">{t('checkout.confirmedText')}</p>

          <div className="p-4 bg-[#0b0b0d] border border-[#17171a] mb-6">
            <p className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-2">{t('checkout.orderNumber')}</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-lg font-bold text-[#c8a96a] tracking-wider">{orderNumber}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(orderNumber);
                  toast.success('Copied!');
                }}
                className="p-1.5 text-[#8a8175] hover:text-[#c8a96a] transition-colors"
                aria-label="Copy order number"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {whatsAppNumber && (
              <a href={generateWhatsAppLink(whatsAppNumber, whatsappMessage)} target="_blank" rel="noopener noreferrer" className="nexora-button-primary flex items-center justify-center gap-2">
                <Smartphone className="w-4 h-4" />
                {t('checkout.confirmWhatsapp')}
              </a>
            )}
            <p className="rounded-2xl border border-[#202024] bg-[#0b0b0d]/60 px-4 py-3 text-xs leading-6 text-[#b8b0a3]">{t('checkout.whatsappNext')}</p>
            <Link to="/shop" className="text-xs text-[#b8b0a3] hover:text-[#c8a96a] transition-colors tracking-wider uppercase">
              {t('common.continueShopping')}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet><title>{t('checkout.title')} | NEXORA</title></Helmet>
      <div className="pt-24 pb-20 bg-[#050505] min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <Link to="/cart" className="flex items-center gap-2 text-xs text-[#b8b0a3] hover:text-[#c8a96a] transition-colors tracking-wider uppercase mb-6">
              <ArrowLeft className="w-3 h-3" />
              Back to Cart
            </Link>
            <p className="nexora-caption text-[#c8a96a] mb-3">{t('checkout.almostThere')}</p>
            <h1 className="nexora-heading-md mb-10">{t('checkout.title').toUpperCase()}</h1>
          </SectionReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="p-6 bg-[#0b0b0d] border border-[#17171a]">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#f4f0e8] mb-5">{t('checkout.personalInfo')}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">{t('checkout.fullName')} *</label>
                      <input {...register('fullName')} className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a] transition-colors" placeholder="Enter your full name" />
                      {errors.fullName && <p className="text-[10px] text-red-400 mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">{t('checkout.phone')} *</label>
                      <input {...register('phone')} className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a] transition-colors" placeholder="01XXXXXXXXX" dir="ltr" />
                      {errors.phone && <p className="text-[10px] text-red-400 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#0b0b0d] border border-[#17171a]">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#f4f0e8] mb-5">{t('checkout.shippingAddress')}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">{t('checkout.governorate')} *</label>
                      <select
                        {...register('governorate')}
                        onChange={(e) => {
                          setSelectedGovernorate(e.target.value);
                          setValue('governorate', e.target.value);
                          setValue('city', '');
                        }}
                        className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a] transition-colors appearance-none"
                      >
                        <option value="">Select Governorate</option>
                        {getGovernorateNames().map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                      {errors.governorate && <p className="text-[10px] text-red-400 mt-1">{errors.governorate.message}</p>}
                    </div>
                    <div>
                      <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">{t('checkout.city')} *</label>
                      <select {...register('city')} disabled={!watchedGovernorate} className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a] transition-colors appearance-none disabled:opacity-50">
                        <option value="">Select City</option>
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      {errors.city && <p className="text-[10px] text-red-400 mt-1">{errors.city.message}</p>}
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">{t('checkout.address')} *</label>
                    <textarea {...register('address')} rows={2} className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a] transition-colors resize-none" placeholder="Building name, street, apartment number, nearest landmark" />
                    {errors.address && <p className="text-[10px] text-red-400 mt-1">{errors.address.message}</p>}
                  </div>
                  <div className="mt-4">
                    <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">{t('checkout.notes')}</label>
                    <textarea {...register('notes')} rows={2} className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] placeholder:text-[#2a2a2d] focus:outline-none focus:border-[#c8a96a] transition-colors resize-none" placeholder="Delivery instructions (optional)" />
                  </div>
                </div>

                <div className="p-6 bg-[#0b0b0d] border border-[#17171a]">
                  <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#f4f0e8] mb-5">{t('checkout.paymentMethod')}</h3>
                  <div className="space-y-3">
                    <button type="button" onClick={() => setValue('paymentMethod', 'cod')} className="w-full flex items-center gap-4 p-4 border border-[#c8a96a] bg-[#c8a96a]/5 transition-all">
                      <Banknote className="w-5 h-5 text-[#c8a96a]" />
                      <div className="text-left rtl:text-right">
                        <p className="text-sm font-medium text-[#f4f0e8]">{t('checkout.cod')}</p>
                        <p className="text-[10px] text-[#8a8175]">{t('checkout.codDesc')}</p>
                      </div>
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full nexora-button-primary py-4 disabled:opacity-50">
                  {isSubmitting ? t('checkout.processing') : `${t('checkout.placeOrder')} — ${formatPrice(total)}`}
                </button>
              </form>
            </div>

            <div className="lg:col-span-1">
              <div className="p-6 bg-[#0b0b0d] border border-[#17171a] sticky top-24">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#f4f0e8] mb-5">{t('checkout.orderSummary')}</h3>
                <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover bg-[#050505]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#f4f0e8] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#8a8175]">Size: {item.size} x{item.quantity}</p>
                      </div>
                      <span className="text-xs text-[#b8b0a3]">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="h-px bg-[#17171a] mb-4" />
                <div className="mb-4">
                  <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Coupon Code</label>
                  <div className="flex gap-2">
                    <input value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} className="flex-1 bg-[#050505] border border-[#202024] px-3 py-2 text-xs text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]" placeholder="NEXORA10" />
                    <button type="button" onClick={applyCoupon} disabled={isCheckingCoupon} className="px-3 py-2 bg-[#c8a96a]/10 text-[#c8a96a] text-[10px] uppercase tracking-wider disabled:opacity-50">{isCheckingCoupon ? '...' : 'Apply'}</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-[#b8b0a3]">{t('checkout.subtotal')}</span><span className="text-[#f4f0e8]">{formatPrice(subtotal)}</span></div>
                  {appliedCoupon && <div className="flex justify-between text-sm"><span className="text-[#b8b0a3]">Discount ({appliedCoupon.code})</span><span className="text-green-400">-{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between text-sm"><span className="text-[#b8b0a3]">{t('checkout.shipping')}</span><span className={shipping === 0 ? 'text-green-400' : 'text-[#f4f0e8]'}>{shipping === 0 ? t('checkout.free') : formatPrice(shipping)}</span></div>
                  <div className="h-px bg-[#17171a] my-2" />
                  <div className="flex justify-between"><span className="text-sm font-bold">{t('checkout.total')}</span><span className="text-lg font-bold text-[#c8a96a]">{formatPrice(total)}</span></div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-[#6f675d]"><Shield className="w-3 h-3" /><span>{t('checkout.secure')}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
