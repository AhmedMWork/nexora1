import { motion } from 'framer-motion';
import { Heart, MessageCircle, RefreshCw, ShoppingBag } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useI18n } from '@/i18n/I18nProvider';

export default function WhyNexoraSection() {
  const { lang } = useI18n();
  const values = lang === 'ar'
    ? [
        { icon: ShoppingBag, title: 'طلب بسيط وواضح', description: 'اختر القطعة، أضفها للسلة، وأكمل الطلب بخطوات قصيرة مع الدفع عند الاستلام.' },
        { icon: Heart, title: 'راحة يومية', description: 'قطع مريحة بتشطيب نظيف وإحساس فاخر مناسب للاستخدام اليومي بدون مبالغة.' },
        { icon: MessageCircle, title: 'دعم قريب منك', description: 'أي سؤال عن المقاس أو الطلب أو الاسترجاع يتم التعامل معه بسهولة عبر واتساب.' },
        { icon: RefreshCw, title: 'استرجاع واضح', description: 'يمكن طلب الاسترجاع خلال 14 يومًا بشرط بقاء المنتج بنفس حالته الأصلية.' },
      ]
    : [
        { icon: ShoppingBag, title: 'Simple Ordering', description: 'Choose your piece, add it to cart, and complete a short cash-on-delivery checkout.' },
        { icon: Heart, title: 'Everyday Comfort', description: 'Comfortable pieces with clean finishing and a premium feel made for daily wear.' },
        { icon: MessageCircle, title: 'Close Support', description: 'Questions about size, orders, or returns are handled easily through WhatsApp.' },
        { icon: RefreshCw, title: 'Clear Returns', description: 'Returns can be requested within 14 days when the item remains in original condition.' },
      ];

  return (
    <section className="py-20 lg:py-32 bg-[var(--v33-bg)]">
      <div className="v3-shell">
        <SectionReveal className="text-center mb-16">
          <p className="nexora-caption mb-3">{lang === 'ar' ? 'تجربة أوضح' : 'A clearer experience'}</p>
          <h2 className="nexora-heading-md">{lang === 'ar' ? 'لماذا NEXORA؟' : 'Why NEXORA?'}</h2>
        </SectionReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <SectionReveal key={value.title} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4 }} className="v41-trust-card h-full">
                <div className="v41-trust-icon"><value.icon className="w-4 h-4" /></div>
                <div>
                  <h3>{value.title}</h3>
                  <p>{value.description}</p>
                </div>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
