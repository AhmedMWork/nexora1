// ============================================================
// NEXORA V3 — Soft Luxury Editorial Navbar
// ============================================================

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, Menu, X, Search, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { NAV_LINKS } from '@/lib/constants';
import ThemeLanguageControls from './ThemeLanguageControls';
import { useI18n } from '@/i18n/I18nProvider';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useI18n();
  const cartCount = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.getCount());
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [location.pathname]);

  const getNavLabel = (href: string, fallback: string) => {
    const keyMap: Record<string, string> = {
      '/': 'nav.home',
      '/shop': 'nav.shop',
      '/shop/men': 'nav.men',
      '/shop/women': 'nav.women',
      '/shop/unisex': 'nav.unisex',
      '/limited': 'nav.drops',
      '/drops': 'nav.drops',
      '/reviews': 'nav.reviews',
      '/contact': 'nav.contact',
    };
    return t(keyMap[href] || fallback);
  };

  const submitSearch = () => {
    const q = searchTerm.trim();
    if (!q) return;
    setIsSearchOpen(false);
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  const isLinkActive = (href: string) => {
    if (href === '/shop') return location.pathname === '/shop';
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <motion.header
        style={{ backgroundColor: 'color-mix(in srgb, var(--v33-card) 88%, transparent)', borderBottomColor: 'color-mix(in srgb, var(--v33-border) 82%, transparent)' }}
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
      >
        <nav className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-[4.35rem]">
            <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="NEXORA home">
              <img src="/assets/nexora-logo-dark.png" alt="NEXORA" className="h-8 w-auto object-contain opacity-95 transition-opacity group-hover:opacity-100 dark:hidden" /><img src="/assets/nexora-logo-ivory.png" alt="NEXORA" className="hidden h-8 w-auto object-contain opacity-95 transition-opacity group-hover:opacity-100 dark:block" />
            </Link>

            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href);
                return (
                  <Link key={link.href} to={link.href} className={`relative text-[11px] font-semibold tracking-[0.12em] transition-colors duration-300 ${active ? 'text-[#5C4A42] dark:text-[#E9DED3]' : 'text-[#8A7A72] hover:text-[#5C4A42] dark:text-[#BBAEA4] dark:hover:text-[#E9DED3]'}`}>
                    {getNavLabel(link.href, link.label)}
                    {active && <motion.div layoutId="nav-indicator" className="absolute -bottom-2 left-0 right-0 h-px bg-[#CFAE9E]" />}
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 lg:gap-2.5">
              <div className="hidden md:block"><ThemeLanguageControls compact /></div>
              <button onClick={() => setIsSearchOpen(true)} className="p-2.5 text-[#8A7A72] hover:text-[#5C4A42] dark:text-[#BBAEA4] dark:hover:text-[#E9DED3] transition-colors" aria-label={t('nav.search')}>
                <Search className="w-4 h-4" />
              </button>
              <Link to="/wishlist" className="relative p-2.5 text-[#8A7A72] hover:text-[#5C4A42] dark:text-[#BBAEA4] dark:hover:text-[#E9DED3] transition-colors" aria-label={t('nav.wishlist')}>
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#CFAE9E] text-[#5C4A42] text-[9px] font-bold flex items-center justify-center rounded-full">{wishlistCount}</span>}
              </Link>
              <Link to="/cart" className="relative p-2.5 text-[#8A7A72] hover:text-[#5C4A42] dark:text-[#BBAEA4] dark:hover:text-[#E9DED3] transition-colors" aria-label={t('nav.cart')}>
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#CFAE9E] text-[#5C4A42] text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
              </Link>
              <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 text-[#8A7A72] hover:text-[#5C4A42] dark:text-[#BBAEA4] dark:hover:text-[#E9DED3] transition-colors" aria-label="Menu">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#F5F0E8] dark:bg-[#171311]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(207,174,158,0.22),transparent_38%),linear-gradient(180deg,rgba(250,247,242,0.92),rgba(236,228,216,0.98))] dark:bg-[radial-gradient(circle_at_top_right,rgba(199,161,145,0.18),transparent_38%),linear-gradient(180deg,rgba(35,29,26,0.9),rgba(23,19,17,1))]" />
            <div className="relative flex flex-col h-full px-6 py-6">
              <div className="flex items-center justify-between mb-10">
                <Link to="/" className="flex items-center gap-3"><img src="/assets/nexora-logo-dark.png" alt="NEXORA" className="h-9 w-auto object-contain opacity-95 dark:hidden" /><img src="/assets/nexora-logo-ivory.png" alt="NEXORA" className="hidden h-9 w-auto object-contain opacity-95 dark:block" /></Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#8A7A72] hover:text-[#5C4A42] dark:text-[#BBAEA4] dark:hover:text-[#E9DED3]" aria-label="Close menu"><X className="w-6 h-6" /></button>
              </div>

              <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
                {[{ label: 'Home', href: '/' }, ...NAV_LINKS].map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.045 }}>
                    <Link to={link.href} onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center justify-between py-4 border-b border-[#CFC3B7]/70 dark:border-[#4A3D37]">
                      <span className="text-2xl font-semibold tracking-wide text-[#5C4A42] group-hover:text-[#A97868] dark:text-[#E9DED3] dark:group-hover:text-[#C7A191] transition-colors">{getNavLabel(link.href, link.label)}</span>
                      <ChevronRight className="w-5 h-5 text-[#8A7A72] group-hover:text-[#A97868] dark:text-[#76675F] transition-colors" />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-[#CFC3B7]/70 dark:border-[#4A3D37]"><div className="flex justify-center mb-5"><ThemeLanguageControls /></div></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#F5F0E8]/95 dark:bg-[#171311]/95 backdrop-blur-xl flex items-start justify-center pt-32">
            <div className="w-full max-w-2xl px-6">
              <div className="flex items-center gap-4 mb-8 border border-[#CFC3B7] bg-[#FAF7F2]/85 dark:border-[#4A3D37] dark:bg-[#231D1A]/85 px-5 py-4 rounded-[18px]">
                <Search className="w-5 h-5 text-[#A97868] dark:text-[#C7A191]" />
                <input type="text" placeholder={t('nav.searchPlaceholder')} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submitSearch(); if (e.key === 'Escape') setIsSearchOpen(false); }} autoFocus className="flex-1 bg-transparent text-xl font-light text-[#5C4A42] dark:text-[#E9DED3] placeholder:text-[#8A7A72] outline-none" />
                <button onClick={() => setIsSearchOpen(false)} className="p-2 text-[#8A7A72] hover:text-[#5C4A42] dark:hover:text-[#E9DED3]" aria-label="Close search"><X className="w-5 h-5" /></button>
              </div>
              <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#8A7A72]">{t('nav.pressEsc')}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
