// ============================================================
// NEXORA V3.4 — Ivory Noir Logo Entry Gate
// The logo is the only entry action. Hidden automatically for Studio routes.
// ============================================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [isLeaving, setIsLeaving] = useState(false);
  const [isVisible, setIsVisible] = useState(() => sessionStorage.getItem('nexora-entry-v34') !== 'entered');

  const handleEnter = useCallback(() => {
    setIsLeaving(true);
    window.setTimeout(() => {
      sessionStorage.setItem('nexora-entry-v34', 'entered');
      setIsVisible(false);
    }, 760);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] overflow-hidden bg-[var(--v33-bg)] flex items-center justify-center"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75, ease: 'easeInOut' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 34%, color-mix(in srgb, var(--v33-accent) 24%, transparent), transparent 24rem), radial-gradient(circle at 18% 80%, color-mix(in srgb, var(--v33-accent-strong) 13%, transparent), transparent 24rem), linear-gradient(135deg, var(--v33-card) 0%, var(--v33-bg) 48%, var(--v33-bg-soft) 100%)',
          }}
        />
        <motion.button
          type="button"
          aria-label="Enter NEXORA"
          onClick={handleEnter}
          initial={{ opacity: 0, y: 24, scale: 0.94 }}
          animate={{ opacity: isLeaving ? 0 : 1, y: 0, scale: isLeaving ? 1.08 : 1, filter: isLeaving ? 'blur(10px)' : 'blur(0px)' }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] items-center justify-center rounded-full v34-logo-plate outline-none focus-visible:ring-4 focus-visible:ring-primary/25"
        >
          <motion.span
            aria-hidden="true"
            className="absolute inset-[-2px] rounded-full border border-[color-mix(in_srgb,var(--v33-accent)_36%,transparent)] opacity-70"
            animate={{ scale: [1, 1.035, 1], opacity: [0.46, 0.9, 0.46] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img
            src="/assets/nexora-logo-dark.png"
            alt="NEXORA"
            className="h-44 w-44 sm:h-60 sm:w-60 object-contain transition-transform duration-500 group-hover:scale-[1.035] dark:hidden"
            draggable={false}
          />
          <motion.img
            src="/assets/nexora-logo-ivory.png"
            alt="NEXORA"
            className="hidden h-44 w-44 sm:h-60 sm:w-60 object-contain transition-transform duration-500 group-hover:scale-[1.035] dark:block"
            draggable={false}
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="absolute bottom-8 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.38em] text-[var(--v33-muted)] opacity-75 transition-opacity group-hover:opacity-100">
            Tap Logo To Enter
          </span>
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
}
