// ============================================================
// NEXORA V4 — Hidden Supabase Studio Layout
// /studio and /admin are link-only, protected by Studio PIN.
// ============================================================

import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AdminSidebar from '@/components/layout/AdminSidebar';
import StudioGate from '@/components/admin/StudioGate';

interface AdminLayoutProps { children: ReactNode; }

export default function AdminLayout({ children }: AdminLayoutProps) {
  const location = useLocation();
  const isStudioRoot = location.pathname === '/nexora-admin/' || location.pathname === '/nexora-admin';
  if (isStudioRoot) return <Navigate to="/nexora-admin/dashboard" replace />;

  return (
    <StudioGate>
      <div className="min-h-screen bg-[var(--v33-bg)] text-[var(--v33-text)]">
        <AdminSidebar />
        <main className="lg:ml-64 min-h-screen">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </StudioGate>
  );
}
