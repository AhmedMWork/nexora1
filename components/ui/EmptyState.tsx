// ============================================================
// NEXORA — Empty State
// ============================================================

import { Link } from 'react-router-dom';
import { Package, Heart, ShoppingBag, Search, MessageSquare } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  type: 'cart' | 'wishlist' | 'orders' | 'search' | 'reviews' | 'products';
  title?: string;
  description?: string;
  action?: ReactNode;
}

const icons = {
  cart: ShoppingBag,
  wishlist: Heart,
  orders: Package,
  search: Search,
  reviews: MessageSquare,
  products: Package,
};

const defaults = {
  cart: {
    title: 'Your Cart is Empty',
    description: 'Explore our collection and add items to your cart.',
  },
  wishlist: {
    title: 'No Saved Items',
    description: 'Save your favorite pieces to your wishlist.',
  },
  orders: {
    title: 'No Orders Found',
    description: 'Place your first order to see it here.',
  },
  search: {
    title: 'No Results Found',
    description: 'Try adjusting your search or filters.',
  },
  reviews: {
    title: 'No Reviews Yet',
    description: 'Be the first to share your experience.',
  },
  products: {
    title: 'No Products Available',
    description: 'Check back soon for new arrivals.',
  },
};

export default function EmptyState({
  type,
  title,
  description,
  action,
}: EmptyStateProps) {
  const Icon = icons[type];
  const defaults_ = defaults[type];

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 flex items-center justify-center border border-[#202024] mb-6">
        <Icon className="w-7 h-7 text-[#2a2a2d]" />
      </div>
      <h3 className="text-lg font-semibold text-[#f4f0e8] mb-2">
        {title || defaults_.title}
      </h3>
      <p className="text-sm text-[#8a8175] max-w-sm mb-6">
        {description || defaults_.description}
      </p>
      {action || (
        <Link to="/shop" className="nexora-button text-xs">
          Continue Shopping
        </Link>
      )}
    </div>
  );
}
