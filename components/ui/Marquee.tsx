// ============================================================
// NEXORA — Kinetic Stripe Marquee
// ============================================================

import { memo } from 'react';

interface MarqueeProps {
  items?: string[];
  speed?: number;
  className?: string;
}

const DEFAULT_ITEMS = [
  'VOID-TEE-01',
  'OBSIDIAN-TEE-02',
  'AMBER-TEE-03',
  'NEXORA-TEE-04',
  'BONE-TEE-05',
  'GRAPHITE-TEE-06',
  'SUMMER-DROP-07',
  'CORE-TEE-08',
];

const Marquee = memo(function Marquee({
  items = DEFAULT_ITEMS,
  speed = 25,
  className = '',
}: MarqueeProps) {
  const text = items.join(' \u00A0\u00A0 // \u00A0\u00A0 ');

  return (
    <div className={`relative overflow-hidden whitespace-nowrap bg-[#2a2a2d] py-5 ${className}`}>
      <div
        className="inline-flex"
        style={{
          animation: `marquee-slide ${speed}s linear infinite`,
        }}
      >
        <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-[#f4f0e8] px-4">
          {text}
        </span>
        <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-[#f4f0e8] px-4">
          {text}
        </span>
      </div>

      {/* Lens effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(110deg, transparent 30%, rgba(255,170,51,0.3) 50%, transparent 70%)',
          backgroundSize: '150% 100%',
          mixBlendMode: 'overlay',
          animation: 'marquee-lens 3s steps(22) infinite',
        }}
      />

      <style>{`
        @keyframes marquee-slide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-lens {
          0% { background-position: 150% 0; }
          100% { background-position: -150% 0; }
        }
      `}</style>
    </div>
  );
});

export default Marquee;
