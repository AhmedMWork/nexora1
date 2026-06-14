// ============================================================
// NEXORA — Skeleton Loader
// ============================================================

import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type?: 'card' | 'page' | 'text' | 'image' | 'product-grid';
  count?: number;
}

export default function SkeletonLoader({ type = 'card', count = 4 }: SkeletonLoaderProps) {
  if (type === 'product-grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
            className="bg-[#0b0b0d] border border-[#17171a]"
          >
            <div className="aspect-[3/4] bg-[#1a1a1a]" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-[#17171a] w-3/4" />
              <div className="h-3 bg-[#17171a] w-1/2" />
              <div className="h-3 bg-[#17171a] w-1/4" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'page') {
    return (
      <div className="w-full space-y-8">
        <div className="h-96 bg-[#0b0b0d] animate-pulse" />
        <div className="px-4 space-y-4">
          <div className="h-8 bg-[#17171a] w-1/3 animate-pulse" />
          <div className="h-4 bg-[#17171a] w-2/3 animate-pulse" />
          <div className="h-4 bg-[#17171a] w-1/2 animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === 'image') {
    return (
      <div className="aspect-square bg-[#1a1a1a] animate-pulse" />
    );
  }

  if (type === 'text') {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-[#17171a] w-full animate-pulse" />
        <div className="h-4 bg-[#17171a] w-5/6 animate-pulse" />
        <div className="h-4 bg-[#17171a] w-4/6 animate-pulse" />
      </div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: [0.3, 0.6, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      className="bg-[#0b0b0d] border border-[#17171a] p-6"
    >
      <div className="space-y-4">
        <div className="h-40 bg-[#1a1a1a]" />
        <div className="h-5 bg-[#17171a] w-2/3" />
        <div className="h-4 bg-[#17171a] w-1/3" />
      </div>
    </motion.div>
  );
}
