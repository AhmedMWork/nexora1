// NEXORA V3.3 — Customer order tracking removed.
// Orders are confirmed directly through WhatsApp and managed internally by Studio.

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function TrackOrderPage() {
  return (
    <main className="pt-32 pb-20 min-h-screen v3-page">
      <Helmet><title>Order Confirmation | NEXORA</title></Helmet>
      <div className="v3-shell max-w-xl mx-auto text-center">
        <div className="v33-empty-panel">
          <p className="text-lg font-semibold text-[var(--v33-text)]">Order tracking is handled through WhatsApp.</p>
          <p className="mt-3 text-sm leading-7 text-[var(--v33-muted)]">After placing a cash-on-delivery order, the NEXORA team will contact you directly to confirm details and delivery.</p>
          <Link to="/shop" className="v3-btn-primary mt-6">Continue Shopping</Link>
        </div>
      </div>
    </main>
  );
}
