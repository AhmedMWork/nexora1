import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Language = 'en' | 'ar';
type Dictionary = Record<string, string>;

const en: Dictionary = {
  'nav.home': 'Home',
  'nav.shop': 'Shop',
  'nav.men': 'Men',
  'nav.women': 'Women',
  'nav.unisex': 'Unisex',
  'nav.admin': 'Studio',
  'nav.drops': 'Limited',
  'nav.reviews': 'Reviews',
  'nav.contact': 'Contact',
  'nav.cart': 'Cart',
  'nav.wishlist': 'Wishlist',
  'nav.search': 'Search',
  'nav.searchPlaceholder': 'Search the collection...',
  'nav.pressEsc': 'Press ESC to close',
  'theme.light': 'Light mode',
  'theme.dark': 'Dark mode',
  'language.english': 'English',
  'language.arabic': 'العربية',
  'common.loading': 'Loading...',
  'common.error': 'Something went wrong. Please try again.',
  'common.tryAgain': 'Try again',
  'common.continueShopping': 'Continue Shopping',
  'common.egp': 'EGP',
  'checkout.title': 'Checkout',
  'checkout.almostThere': 'Almost There',
  'checkout.personalInfo': 'Personal Information',
  'checkout.fullName': 'Full Name',
  'checkout.phone': 'Phone Number',
  'checkout.email': 'Email',
  'checkout.shippingAddress': 'Shipping Address',
  'checkout.governorate': 'Governorate',
  'checkout.city': 'City',
  'checkout.address': 'Street Address',
  'checkout.notes': 'Additional Notes',
  'checkout.paymentMethod': 'Payment Method',
  'checkout.cod': 'Cash on Delivery',
  'checkout.codDesc': 'Pay when you receive your order',
  'checkout.placeOrder': 'Place Order',
  'checkout.processing': 'Processing...',
  'checkout.orderSummary': 'Order Summary',
  'checkout.subtotal': 'Subtotal',
  'checkout.shipping': 'Shipping',
  'checkout.free': 'Free',
  'checkout.total': 'Total',
  'checkout.secure': 'Secure checkout. Your data is protected.',
  'checkout.confirmed': 'Order Confirmed',
  'checkout.confirmedText': 'Thank you for your purchase. We received your order and will contact you shortly to confirm it.',
  'checkout.orderNumber': 'Order Number',
  'checkout.confirmWhatsapp': 'Confirm via WhatsApp',
  'checkout.whatsappNext': 'We will confirm your order on WhatsApp shortly.',
  'checkout.failed': 'We could not place your order. Please check your connection and try again.',
  'track.caption': 'Order Support',
  'track.title': 'Order Support',
  'track.orderNumber': 'Order Number',
  'track.phone': 'Phone Number',
  'track.placeholderOrder': 'Enter order number (e.g., NXR-240613-AB12)',
  'track.placeholderPhone': 'Enter phone used for the order',
  'track.action': 'Check',
  'track.notFound': 'We could not find this order. Please check your order number and phone number.',
  'track.customer': 'Customer',
  'track.location': 'Location',
  'track.payment': 'Payment',
  'track.progress': 'Order Status',
  'track.updates': 'Internal Updates',
  'status.pending': 'Pending',
  'status.confirmed': 'Confirmed',
  'status.preparing': 'Preparing',
  'status.shipped': 'Shipped',
  'status.out_for_delivery': 'Out for Delivery',
  'status.delivered': 'Delivered',
  'status.cancelled': 'Cancelled',
  'status.returned': 'Returned',
  'footer.newsletterCaption': 'Stay In The Loop',
  'footer.newsletterTitleA': 'Join The',
  'footer.newsletterTitleB': 'Circle',
  'footer.newsletterText': 'Limited releases, private edits, and early access to the next NEXORA pieces.',
  'footer.subscribe': 'Subscribe',
  'footer.emailPlaceholder': 'Enter your email',
  'footer.brandText': 'Soft luxury essentials, refined for quiet confidence and everyday presence.',
  'footer.shop': 'Shop',
  'footer.support': 'Support',
  'footer.company': 'Company',
  'footer.adminAccess': 'Admin Access',
  'footer.privacy': 'Privacy Policy',
  'footer.terms': 'Terms of Service',
  'info.about.title': 'About NEXORA',
  'info.about.body': 'NEXORA is built for those who move differently. Clean silhouettes, premium materials, and quiet confidence in every detail.',
  'info.sizeGuide.title': 'Size Guide',
  'info.sizeGuide.body': 'Use the size guide before ordering. Oversized pieces are intentionally relaxed, while fitted pieces are closer to the body.',
  'info.shipping.title': 'Shipping & Returns',
  'info.shipping.body': 'Orders are confirmed by phone or WhatsApp. Delivery fees and exchange options are shown clearly before checkout.',
  'info.faq.title': 'FAQs',
  'info.faq.body': 'Find quick answers about sizes, delivery, cash on delivery, exchanges, and WhatsApp confirmation.',
  'info.privacy.title': 'Privacy Policy',
  'info.privacy.body': 'We collect only the information needed to process and deliver your order. Customer data is never sold.',
  'info.terms.title': 'Terms of Service',
  'info.terms.body': 'By placing an order, you agree to provide accurate contact and delivery information and to review your order before confirmation.',
};

const ar: Dictionary = {
  'nav.home': 'الرئيسية',
  'nav.shop': 'المتجر',
  'nav.men': 'رجالي',
  'nav.women': 'نسائي',
  'nav.unisex': 'يونيسكس',
  'nav.admin': 'الاستوديو',
  'nav.drops': 'المحدود',
  'nav.reviews': 'التقييمات',
  'nav.contact': 'تواصل معنا',
  'nav.cart': 'السلة',
  'nav.wishlist': 'المفضلة',
  'nav.search': 'بحث',
  'nav.searchPlaceholder': 'ابحث داخل المجموعة...',
  'nav.pressEsc': 'اضغط ESC للإغلاق',
  'theme.light': 'الوضع الفاتح',
  'theme.dark': 'الوضع الداكن',
  'language.english': 'English',
  'language.arabic': 'العربية',
  'common.loading': 'جاري التحميل...',
  'common.error': 'حدث خطأ غير متوقع حاول مرة أخرى',
  'common.tryAgain': 'حاول مرة أخرى',
  'common.continueShopping': 'متابعة التسوق',
  'common.egp': 'جنيه',
  'checkout.title': 'إتمام الطلب',
  'checkout.almostThere': 'اقتربت من النهاية',
  'checkout.personalInfo': 'البيانات الشخصية',
  'checkout.fullName': 'الاسم بالكامل',
  'checkout.phone': 'رقم الهاتف',
  'checkout.email': 'البريد الإلكتروني',
  'checkout.shippingAddress': 'عنوان الشحن',
  'checkout.governorate': 'المحافظة',
  'checkout.city': 'المدينة',
  'checkout.address': 'العنوان التفصيلي',
  'checkout.notes': 'ملاحظات إضافية',
  'checkout.paymentMethod': 'طريقة الدفع',
  'checkout.cod': 'الدفع عند الاستلام',
  'checkout.codDesc': 'ادفع عند استلام الطلب',
  'checkout.placeOrder': 'تأكيد الطلب',
  'checkout.processing': 'جاري المعالجة...',
  'checkout.orderSummary': 'ملخص الطلب',
  'checkout.subtotal': 'قيمة المنتجات',
  'checkout.shipping': 'الشحن',
  'checkout.free': 'مجاني',
  'checkout.total': 'الإجمالي',
  'checkout.secure': 'إتمام طلب آمن وبياناتك محمية',
  'checkout.confirmed': 'تم استلام الطلب',
  'checkout.confirmedText': 'شكرًا لطلبك تم تسجيل الطلب وسنتواصل معك قريبًا لتأكيده',
  'checkout.orderNumber': 'رقم الطلب',
  'checkout.confirmWhatsapp': 'تأكيد عبر واتساب',
  'checkout.whatsappNext': 'سنتواصل معك على واتساب قريبًا لتأكيد الطلب.',
  'checkout.failed': 'لم نتمكن من تسجيل الطلب تأكد من الاتصال وحاول مرة أخرى',
  'track.caption': 'دعم الطلب',
  'track.title': 'دعم الطلب',
  'track.orderNumber': 'رقم الطلب',
  'track.phone': 'رقم الهاتف',
  'track.placeholderOrder': 'اكتب رقم الطلب مثال NXR-240613-AB12',
  'track.placeholderPhone': 'اكتب رقم الهاتف المستخدم في الطلب',
  'track.action': 'تحقق',
  'track.notFound': 'لم نتمكن من العثور على هذا الطلب تأكد من رقم الطلب ورقم الهاتف',
  'track.customer': 'العميل',
  'track.location': 'الموقع',
  'track.payment': 'الدفع',
  'track.progress': 'حالة داخلية',
  'track.updates': 'تحديثات داخلية',
  'status.pending': 'قيد المراجعة',
  'status.confirmed': 'تم التأكيد',
  'status.preparing': 'جاري التجهيز',
  'status.shipped': 'تم الشحن',
  'status.out_for_delivery': 'خرج للتوصيل',
  'status.delivered': 'تم التسليم',
  'status.cancelled': 'تم الإلغاء',
  'status.returned': 'مرتجع',
  'footer.newsletterCaption': 'تابع الجديد',
  'footer.newsletterTitleA': 'انضم إلى',
  'footer.newsletterTitleB': 'NEXORA',
  'footer.newsletterText': 'إصدارات محدودة وتحديثات مبكرة عن أحدث قطع NEXORA',
  'footer.subscribe': 'اشترك',
  'footer.emailPlaceholder': 'اكتب بريدك الإلكتروني',
  'footer.brandText': 'أساسيات فاخرة بهدوء، مصممة لحضور يومي واثق.',
  'footer.shop': 'المتجر',
  'footer.support': 'الدعم',
  'footer.company': 'الشركة',
  'footer.adminAccess': 'الاستوديو',
  'footer.privacy': 'سياسة الخصوصية',
  'footer.terms': 'الشروط والأحكام',
  'info.about.title': 'عن NEXORA',
  'info.about.body': 'نيكسورا تجربة أزياء هادئة بتفاصيل نظيفة وخامات مختارة، مصممة لأسلوب عصري مختلف دون مبالغة.',
  'info.sizeGuide.title': 'دليل المقاسات',
  'info.sizeGuide.body': 'راجع دليل المقاسات قبل الطلب القطع الواسعة مصممة لتكون مريحة والقطع الضيقة أقرب للجسم',
  'info.shipping.title': 'الشحن والاستبدال',
  'info.shipping.body': 'يتم تأكيد الطلب عبر الهاتف أو واتساب وتظهر تكلفة الشحن وخيارات الاستبدال بوضوح قبل إتمام الطلب',
  'info.faq.title': 'الأسئلة الشائعة',
  'info.faq.body': 'إجابات سريعة عن المقاسات والتوصيل والدفع عند الاستلام والاستبدال وتأكيد الطلب عبر واتساب',
  'info.privacy.title': 'سياسة الخصوصية',
  'info.privacy.body': 'نجمع فقط البيانات اللازمة لتجهيز وتوصيل طلبك ولا يتم بيع بيانات العملاء',
  'info.terms.title': 'الشروط والأحكام',
  'info.terms.body': 'بإتمام الطلب فأنت توافق على إدخال بيانات تواصل وتوصيل صحيحة ومراجعة الطلب قبل التأكيد',
};

interface I18nContextValue {
  lang: Language;
  direction: 'ltr' | 'rtl';
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = 'nexora-language';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === 'ar' || saved === 'en' ? saved : 'en';
  });

  useEffect(() => {
    const direction = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    document.documentElement.dir = direction;
    document.body.dir = direction;
    document.body.classList.toggle('rtl', lang === 'ar');
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const dictionary = lang === 'ar' ? ar : en;

  const value = useMemo<I18nContextValue>(() => ({
    lang,
    direction: lang === 'ar' ? 'rtl' : 'ltr',
    setLang: setLangState,
    toggleLang: () => setLangState((current) => (current === 'en' ? 'ar' : 'en')),
    t: (key: string) => dictionary[key] || en[key] || key,
  }), [lang, dictionary]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
