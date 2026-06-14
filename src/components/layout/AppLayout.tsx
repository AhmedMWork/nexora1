// ============================================================
// NEXORA — App Layout (Navbar + Footer wrapper)
// ============================================================

import { type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f0e8]">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
