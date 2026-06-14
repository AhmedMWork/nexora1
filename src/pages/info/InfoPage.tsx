import type { ElementType } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, CheckCircle, Ruler, Truck, RotateCcw, Shield } from 'lucide-react';
import SectionReveal from '@/components/ui/SectionReveal';
import { useI18n } from '@/i18n/I18nProvider';

const pageMap: Record<string, { titleKey: string; bodyKey: string; icon: ElementType }> = {
  about: { titleKey: 'info.about.title', bodyKey: 'info.about.body', icon: Shield },
  'size-guide': { titleKey: 'info.sizeGuide.title', bodyKey: 'info.sizeGuide.body', icon: Ruler },
  'shipping-returns': { titleKey: 'info.shipping.title', bodyKey: 'info.shipping.body', icon: Truck },
  faq: { titleKey: 'info.faq.title', bodyKey: 'info.faq.body', icon: CheckCircle },
  privacy: { titleKey: 'info.privacy.title', bodyKey: 'info.privacy.body', icon: Shield },
  terms: { titleKey: 'info.terms.title', bodyKey: 'info.terms.body', icon: RotateCcw },
};

export default function InfoPage() {
  const { slug = 'about' } = useParams<{ slug: string }>();
  const { t } = useI18n();
  const page = pageMap[slug] || pageMap.about;
  const Icon = page.icon;

  const title = t(page.titleKey);
  const body = t(page.bodyKey);

  return (
    <>
      <Helmet>
        <title>{title} | NEXORA</title>
        <meta name="description" content={body} />
      </Helmet>
      <div className="pt-24 pb-20 bg-[#050505] min-h-screen">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-10">
          <SectionReveal>
            <Link to="/" className="inline-flex items-center gap-2 text-xs text-[#b8b0a3] hover:text-[#c8a96a] transition-colors tracking-wider uppercase mb-8">
              <ArrowLeft className="w-3 h-3" />
              NEXORA
            </Link>
            <div className="w-14 h-14 flex items-center justify-center border border-[#c8a96a]/30 bg-[#c8a96a]/10 mb-6">
              <Icon className="w-6 h-6 text-[#c8a96a]" />
            </div>
            <p className="nexora-caption text-[#c8a96a] mb-3">Built Different</p>
            <h1 className="nexora-heading-md mb-6">{title}</h1>
            <p className="text-base sm:text-lg text-[#b8b0a3] leading-relaxed max-w-3xl">{body}</p>
          </SectionReveal>

          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Premium Fabric', text: 'Carefully selected materials for everyday comfort.' },
              { label: 'Clear Process', text: 'Simple ordering, WhatsApp confirmation, and delivery updates.' },
              { label: 'Customer First', text: 'Support through WhatsApp, contact forms, and order updates.' },
            ].map((item) => (
              <div key={item.label} className="p-5 bg-[#0b0b0d] border border-[#17171a]">
                <h3 className="text-xs font-bold text-[#f4f0e8] uppercase tracking-wider mb-2">{item.label}</h3>
                <p className="text-xs text-[#8a8175] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
