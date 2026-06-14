// ============================================================
// NEXORA — Star Rating
// ============================================================

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
  reviewCount?: number;
  className?: string;
}

export default function StarRating({
  rating,
  maxRating = 5,
  size = 14,
  showValue = false,
  reviewCount,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, i) => {
          const fillPercent = Math.min(100, Math.max(0, (rating - i) * 100));
          return (
            <div key={i} className="relative">
              <Star
                size={size}
                className="text-[#2a2a2d]"
                strokeWidth={0}
                fill="currentColor"
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star
                  size={size}
                  className="text-[#c8a96a]"
                  strokeWidth={0}
                  fill="currentColor"
                />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs text-[#b8b0a3] ml-1">{rating.toFixed(1)}</span>
      )}
      {reviewCount !== undefined && (
        <span className="text-xs text-[#8a8175] ml-1">({reviewCount})</span>
      )}
    </div>
  );
}
