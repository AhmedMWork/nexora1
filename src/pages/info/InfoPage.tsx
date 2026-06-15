import type { ElementType } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle, HelpCircle, RotateCcw, Shield, Truck } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useI18n } from '@/i18n/I18nProvider';

type InfoSlug = 'about' | 'shipping-returns' | 'faq' | 'privacy' | 'terms';

const pageMap: Record<InfoSlug, { titleKey: string; bodyKey: string; icon: ElementType }> = {
  about: { titleKey: 'info.about.title', bodyKey: 'info.about.body', icon: Shield },
  'shipping-returns': { titleKey: 'info.shipping.title', bodyKey: 'info.shipping.body', icon: Truck },
  faq: { titleKey: 'info.faq.title', bodyKey: 'info.faq.body', icon: HelpCircle },
  privacy: { titleKey: 'info.privacy.title', bodyKey: 'info.privacy.body', icon: Shield },
  terms: { titleKey: 'info.terms.title', bodyKey: 'info.terms.body', icon: RotateCcw },
};

const faq = {
  en: [
    ['How long does delivery take?', 'Delivery usually takes 3 to 7 business days depending on the governorate and order volume.'],
    ['Is Cash on Delivery available?', 'Yes. NEXORA currently uses Cash on Delivery only, so you pay when the order arrives.'],
    ['Can I return an item?', 'Returns can be requested within 14 days if the item is unused, in original condition, and with its packaging when applicable.'],
    ['Who pays return shipping?', 'Return shipping is covered by the customer unless the issue was caused by NEXORA.'],
    ['How do I choose the right size?', 'Each product includes available sizes and stock. If you are unsure, contact us on WhatsApp before ordering.'],
    ['Can I change my order after submitting it?', 'Contact us quickly on WhatsApp. If the order has not been prepared yet, we will help you adjust it.'],
  ],
  ar: [
    ['مدة الشحن قد إيه؟', 'الشحن عادةً خلال 3 إلى 7 أيام عمل حسب المحافظة وضغط الطلبات.'],
    ['هل الدفع عند الاستلام متاح؟', 'نعم، الدفع حاليًا عند الاستلام فقط، وتدفع عند وصول الطلب.'],
    ['هل أقدر أرجع المنتج؟', 'يمكن طلب الاسترجاع خلال 14 يومًا بشرط أن يكون المنتج غير مستخدم وبنفس حالته الأصلية وبالتغليف إن وجد.'],
    ['مين يتحمل شحن الاسترجاع؟', 'العميل يتحمل تكلفة شحن الاسترجاع إلا إذا كان الخطأ من طرف NEXORA.'],
    ['إزاي أختار المقاس المناسب؟', 'كل منتج يظهر المقاسات المتاحة والمخزون. لو محتار في المقاس، تواصل معنا على واتساب قبل الطلب.'],
    ['هل أقدر أعدل الطلب بعد التأكيد؟', 'تواصل معنا بسرعة عبر واتساب. إذا لم يبدأ تجهيز الطلب سنساعدك في التعديل.'],
  ],
};

const valueCards = {
  en: [
    ['Simple Ordering', 'Choose your piece, add it to cart, and confirm your order through a clear COD checkout.'],
    ['Everyday Comfort', 'Clean finishing and comfortable materials designed for daily wear.'],
    ['Close Support', 'Questions about size or orders are handled easily through WhatsApp.'],
  ],
  ar: [
    ['طلب بسيط وواضح', 'اختر القطعة، أضفها للسلة، وأكمل الطلب بسهولة بالدفع عند الاستلام.'],
    ['راحة مناسبة لكل يوم', 'تشطيب نظيف وخامات مريحة مصممة للاستخدام اليومي.'],
    ['دعم قريب منك', 'أي سؤال عن المقاس أو الطلب يمكنك إرساله بسهولة عبر واتساب.'],
  ],
};

export default function InfoPage() {
  const { slug = 'about' } = useParams<{ slug: string }>();
  const { t, lang } = useI18n();
  const safeSlug = (slug === 'size-guide' ? 'faq' : slug) as InfoSlug;
  const page = pageMap[safeSlug] || pageMap.about;
  const Icon = page.icon;
  const title = t(page.titleKey);
  const body = t(page.bodyKey);
  const isFaq = safeSlug === 'faq';

  return (
    <>
      <Helmet>
        <title>{title} | NEXORA</title>
        <meta name="description" content={body} />
        {isFaq && (
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq[lang].map(([question, answer]) => ({
              '@type': 'Question',
              name: question,
              acceptedAnswer: { '@type': 'Answer', text: answer },
            })),
          })}</script>
        )}
      </Helmet>
      <main className="min-h-screen bg-[var(--v33-bg)] pt-24 pb-20 text-[var(--v33-text)]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <Link to="/" className="mb-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[var(--v33-muted)] transition-colors hover:text-[var(--v33-accent-strong)]">
              <ArrowLeft className="h-3 w-3" />
              NEXORA
            </Link>
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--v33-border)] bg-[var(--v33-card)] shadow-[0_14px_40px_var(--v33-shadow)]">
              <Icon className="h-6 w-6 text-[var(--v33-accent-strong)]" />
            </div>
            <p className="v3-kicker mb-3">NEXORA</p>
            <h1 className="nexora-heading-md mb-6">{title}</h1>
            <p className="max-w-3xl text-base leading-8 text-[var(--v33-muted)] sm:text-lg">{body}</p>
          </SectionReveal>

          {isFaq && (
            <section className="mt-12 space-y-4">
              {faq[lang].map(([question, answer], index) => (
                <SectionReveal key={question} delay={index * 0.035}>
                  <div className="rounded-[24px] border border-[var(--v33-border)] bg-[var(--v33-card)] p-5 shadow-[0_20px_60px_var(--v33-shadow)]">
                    <div className="flex gap-4">
                      <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-[var(--v33-accent-strong)]" />
                      <div>
                        <h2 className="text-base font-semibold text-[var(--v33-text)]">{question}</h2>
                        <p className="mt-2 text-sm leading-7 text-[var(--v33-muted)]">{answer}</p>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </section>
          )}

          {safeSlug === 'shipping-returns' && (
            <section className="mt-12 grid gap-4 md:grid-cols-3">
              {(lang === 'ar'
                ? [['مدة الشحن', 'من 3 إلى 7 أيام عمل حسب المحافظة.'], ['الاسترجاع', 'خلال 14 يومًا بشرط الحالة الأصلية.'], ['تكلفة الاسترجاع', 'يتحملها العميل إلا إذا كان الخطأ من طرفنا.']]
                : [['Delivery Time', '3 to 7 business days depending on the governorate.'], ['Returns', 'Within 14 days when the item remains in original condition.'], ['Return Shipping', 'Covered by the customer unless the issue was caused by us.']]
              ).map(([label, text]) => (
                <div key={label} className="rounded-[24px] border border-[var(--v33-border)] bg-[var(--v33-card)] p-5">
                  <h3 className="text-sm font-semibold text-[var(--v33-text)]">{label}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--v33-muted)]">{text}</p>
                </div>
              ))}
            </section>
          )}

          <section className="mt-12 grid gap-4 sm:grid-cols-3">
            {valueCards[lang].map(([label, text]) => (
              <div key={label} className="rounded-[24px] border border-[var(--v33-border)] bg-[var(--v33-card)] p-5">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--v33-text)]">{label}</h3>
                <p className="text-sm leading-7 text-[var(--v33-muted)]">{text}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </>
  );
}
