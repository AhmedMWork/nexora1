// ============================================================
// NEXORA — Midnight Atelier Hero Section
// ============================================================

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050505] pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(200,169,106,0.16),transparent_28%),radial-gradient(circle_at_78%_18%,rgba(244,240,232,0.08),transparent_24%),linear-gradient(135deg,#050505_0%,#0b0b0d_45%,#17171a_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c8a96a]/40 to-transparent" />
      <div className="absolute right-0 top-24 hidden h-[620px] w-[620px] rounded-full border border-[#c8a96a]/10 lg:block" />
      <div className="absolute right-24 top-48 hidden h-[360px] w-[360px] rounded-full border border-[#f4f0e8]/5 lg:block" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
        <div className="grid lg:grid-cols-[1.03fr_0.97fr] gap-12 lg:gap-16 items-center min-h-[76vh]">
          <div className="order-2 lg:order-1 flex flex-col justify-center max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="mb-6 inline-flex w-fit items-center gap-2 border border-[#c8a96a]/25 bg-[#0b0b0d]/70 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#c8a96a]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Midnight Atelier
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.78 }}
              className="nexora-heading-lg mb-7 text-[#f4f0e8]"
            >
              BUILT
              <br />
              <span className="text-gradient">DIFFERENT</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.65 }}
              className="max-w-xl text-base leading-8 text-[#b8b0a3] sm:text-lg"
            >
              Premium essentials with a quiet edge. Clean silhouettes, refined fabric weight,
              and a presence built for every day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.43, duration: 0.65 }}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link to="/shop" className="nexora-button-primary inline-flex items-center justify-center gap-3">
                Shop New Arrivals
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/limited" className="nexora-button inline-flex items-center justify-center">
                Explore Limited
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62, duration: 0.8 }}
              className="mt-12 grid max-w-xl grid-cols-3 border-y border-[#202024] py-5"
            >
              {[
                ['Premium Cotton', 'Fabric'],
                ['Limited Runs', 'Limited'],
                ['Egypt', 'Crafted'],
              ].map(([value, label]) => (
                <div key={value} className="border-r border-[#202024] px-3 last:border-r-0 first:pl-0">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#f4f0e8]">{value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[#8a8175]">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.9, ease: 'easeOut' }}
            className="order-1 lg:order-2 relative flex items-center justify-center"
          >
            <div className="relative w-full max-w-[520px]">
              <div className="absolute -inset-4 border border-[#c8a96a]/15" />
              <div className="absolute -right-5 -top-5 hidden h-32 w-32 border border-[#c8a96a]/25 sm:block" />
              <div className="absolute -bottom-6 -left-6 hidden h-40 w-40 border border-[#f4f0e8]/10 sm:block" />
              <div className="relative aspect-[4/5] overflow-hidden bg-[#0b0b0d] ring-1 ring-[#202024]">
                <img
                  src="/assets/hero-model.jpg"
                  alt="NEXORA premium essentials"
                  className="h-full w-full object-cover opacity-90 saturate-[0.82] contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/75 via-transparent to-[#050505]/10" />
                <div className="absolute bottom-5 left-5 right-5 border border-[#c8a96a]/20 bg-[#050505]/65 p-4 backdrop-blur-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#c8a96a]">NEXORA Standard</p>
                  <p className="mt-2 text-sm leading-6 text-[#f4f0e8]/85">Elevated fit. Balanced weight. Made to move differently.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 gradient-overlay-bottom pointer-events-none" />
    </section>
  );
}
