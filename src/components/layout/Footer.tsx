// ============================================================
// NEXORA — Midnight Atelier Footer
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FOOTER_LINKS } from '@/lib/constants';
import { useI18n } from '@/i18n/I18nProvider';

const newsletterSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type NewsletterForm = z.infer<typeof newsletterSchema>;

export default function Footer() {
  const { t } = useI18n();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterForm>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterForm) => {
    setIsSubmitting(true);
    try {
      const { subscribeNewsletter } = await import('@/lib/supabase/db');
      await subscribeNewsletter(data.email);
      toast.success('Subscribed to NEXORA updates');
      reset();
    } catch {
      toast.error('Subscription failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFooterLink = (link: { label: string; href: string }) => {
    const label = link.label;
    return (
      <Link
        to={link.href}
        className="text-xs text-[#8A7A72] dark:text-[#BBAEA4] hover:text-[#A97868] dark:hover:text-[#C7A191] transition-colors"
      >
        {label}
      </Link>
    );
  };

  return (
    <footer className="relative overflow-hidden bg-[#F5F0E8] dark:bg-[#171311] border-t border-[#CFC3B7]/70 dark:border-[#4A3D37]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#CFAE9E]/50 to-transparent" />
      <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#CFAE9E]/15 blur-3xl" />

      <div className="w-full px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="border border-[#CFC3B7]/70 bg-[#FAF7F2]/80 dark:border-[#4A3D37] dark:bg-[#231D1A]/80 rounded-[28px] px-5 py-12 sm:px-10"
          >
            <p className="nexora-caption mb-4 text-[#A97868] dark:text-[#C7A191]">{t('footer.newsletterCaption')}</p>
            <h3 className="nexora-heading-md mb-6">
              {t('footer.newsletterTitleA')}
              <span className="text-[#A97868] dark:text-[#C7A191]"> NEXORA </span>
              {t('footer.newsletterTitleB')}
            </h3>
            <p className="text-[#8A7A72] dark:text-[#BBAEA4] text-sm max-w-md mx-auto mb-8 leading-7">
              {t('footer.newsletterText')}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <div className="flex-1 relative">
                <input
                  {...register('email')}
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="w-full bg-[#050505] border border-[#CFC3B7] dark:border-[#4A3D37] px-5 py-3.5 text-sm text-[#5C4A42] dark:text-[#E9DED3] placeholder:text-[#8A7A72] dark:placeholder:text-[#76675F] focus:outline-none focus:border-[#c8a96a] transition-colors"
                />
                {errors.email && (
                  <span className="absolute -bottom-5 left-0 text-[10px] text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="nexora-button-primary flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? '...' : t('footer.subscribe')}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="nexora-divider" />

      <div className="w-full px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img
                src="/assets/nexora-logo-dark.png"
                alt="NEXORA"
                className="h-10 w-auto object-contain opacity-90 dark:hidden"
              />
              <img
                src="/assets/nexora-logo-ivory.png"
                alt="NEXORA"
                className="hidden h-10 w-auto object-contain opacity-90 dark:block"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#5C4A42] dark:text-[#E9DED3]">NEXORA</span>
            </Link>
            <p className="text-xs text-[#8A7A72] dark:text-[#BBAEA4] leading-relaxed mb-6 max-w-[220px]">
              {t('footer.brandText')}
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 flex items-center justify-center border border-[#CFC3B7] dark:border-[#4A3D37] text-[#8A7A72] dark:text-[#BBAEA4] hover:text-[#A97868] dark:text-[#C7A191] hover:border-[#c8a96a]/50 transition-colors"
                  aria-label="NEXORA social profile"
                >
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {[
            [t('footer.shop'), FOOTER_LINKS.shop],
            [t('footer.support'), FOOTER_LINKS.support],
            [t('footer.company'), FOOTER_LINKS.company],
          ].map(([title, links]) => (
            <div key={String(title)}>
              <h4 className="text-xs font-black tracking-[0.22em] uppercase text-[#5C4A42] dark:text-[#E9DED3] mb-5">
                {String(title)}
              </h4>
              <ul className="space-y-3">
                {(links as typeof FOOTER_LINKS.shop).map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    {renderFooterLink(link)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="nexora-divider" />

      <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-[#8A7A72] dark:text-[#76675F] tracking-wider">
            &copy; {new Date().getFullYear()} NEXORA. Built Different.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <Link to="/info/privacy" className="text-[10px] text-[#8A7A72] dark:text-[#76675F] hover:text-[#b8b0a3] transition-colors tracking-wider">
              {t('footer.privacy')}
            </Link>
            <Link to="/info/terms" className="text-[10px] text-[#8A7A72] dark:text-[#76675F] hover:text-[#b8b0a3] transition-colors tracking-wider">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
