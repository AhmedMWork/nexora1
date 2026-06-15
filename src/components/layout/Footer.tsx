import type { SVGProps } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.6 3c.45 2.7 1.95 4.35 4.4 4.55v3.35a8.25 8.25 0 0 1-4.28-1.25v5.95c0 3.25-2.16 5.4-5.35 5.4-3.06 0-5.37-2.2-5.37-5.1 0-3.06 2.42-5.28 5.78-5.28.35 0 .68.03 1 .1v3.42a3.6 3.6 0 0 0-1.04-.16c-1.32 0-2.21.75-2.21 1.86 0 1.06.82 1.8 1.95 1.8 1.24 0 2.02-.77 2.02-2.1V3h3.1Z" />
    </svg>
  );
}

const socialLinks = [
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'Facebook', href: '#', Icon: Facebook },
  { label: 'TikTok', href: '#', Icon: TikTokIcon },
  { label: 'WhatsApp', href: 'https://wa.me/201037141322', Icon: MessageCircle },
];

export default function Footer() {
  const { lang, t } = useI18n();

  const groups = [
    {
      title: t('footer.shop'),
      links: lang === 'ar'
        ? [
            { label: 'كل المنتجات', href: '/shop' },
            { label: 'وصل حديثًا', href: '/shop?sort=newest' },
            { label: 'الإصدارات المحدودة', href: '/limited' },
            { label: 'رجالي', href: '/shop/men' },
            { label: 'نسائي', href: '/shop/women' },
            { label: 'يونيسكس', href: '/shop/unisex' },
          ]
        : [
            { label: 'All Products', href: '/shop' },
            { label: 'New Arrivals', href: '/shop?sort=newest' },
            { label: 'Limited Drops', href: '/limited' },
            { label: 'Men', href: '/shop/men' },
            { label: 'Women', href: '/shop/women' },
            { label: 'Unisex', href: '/shop/unisex' },
          ],
    },
    {
      title: t('footer.support'),
      links: lang === 'ar'
        ? [
            { label: 'الشحن والاسترجاع', href: '/info/shipping-returns' },
            { label: 'الأسئلة الشائعة', href: '/info/faq' },
            { label: 'تواصل معنا', href: '/contact' },
          ]
        : [
            { label: 'Shipping & Returns', href: '/info/shipping-returns' },
            { label: 'FAQs', href: '/info/faq' },
            { label: 'Contact Us', href: '/contact' },
          ],
    },
    {
      title: t('footer.company'),
      links: lang === 'ar'
        ? [
            { label: 'عن NEXORA', href: '/info/about' },
            { label: 'سياسة الخصوصية', href: '/info/privacy' },
            { label: 'الشروط والأحكام', href: '/info/terms' },
          ]
        : [
            { label: 'About NEXORA', href: '/info/about' },
            { label: 'Privacy Policy', href: '/info/privacy' },
            { label: 'Terms of Service', href: '/info/terms' },
          ],
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[var(--v33-border)] bg-[var(--v33-card)]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--v33-accent)]/50 to-transparent" />
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[var(--v33-accent)]/15 blur-3xl" />

      <div className="relative w-full px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:gap-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="col-span-2 lg:col-span-1"
          >
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img src="/assets/nexora-logo-dark.png" alt="NEXORA" className="h-11 w-auto object-contain opacity-95 dark:hidden" />
              <img src="/assets/nexora-logo-ivory.png" alt="NEXORA" className="hidden h-11 w-auto object-contain opacity-95 dark:block" />
            </Link>
            <p className="max-w-[280px] text-sm leading-7 text-[var(--v33-muted)]">{t('footer.brandText')}</p>
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`NEXORA ${label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--v33-border)] text-[var(--v33-muted)] transition-colors hover:border-[var(--v33-accent)] hover:text-[var(--v33-accent-strong)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </motion.div>

          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-5 text-xs font-black uppercase tracking-[0.22em] text-[var(--v33-text)]">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link to={link.href} className="text-sm text-[var(--v33-muted)] transition-colors hover:text-[var(--v33-accent-strong)]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="nexora-divider" />
      <div className="w-full px-4 py-6 sm:px-6 lg:px-10">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--v33-subtle)]">
            © {new Date().getFullYear()} NEXORA. {lang === 'ar' ? 'كل الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link to="/info/privacy" className="text-[10px] uppercase tracking-[0.18em] text-[var(--v33-subtle)] hover:text-[var(--v33-accent-strong)]">
              {t('footer.privacy')}
            </Link>
            <Link to="/info/terms" className="text-[10px] uppercase tracking-[0.18em] text-[var(--v33-subtle)] hover:text-[var(--v33-accent-strong)]">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
