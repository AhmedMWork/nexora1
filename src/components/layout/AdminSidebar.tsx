// ============================================================
// NEXORA — Admin Sidebar Navigation
// ============================================================

import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Star,
  Tag,
  CalendarClock,
  BarChart3,
  UserRound,
  SearchCheck,
  ShieldCheck,
  ChevronLeft,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { useState } from 'react';
import { ADMIN_NAV_LINKS } from '@/lib/constants';

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Warehouse,
  Star,
  Tag,
  CalendarClock,
  BarChart3,
  UserRound,
  SearchCheck,
  ShieldCheck,
};

export default function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const sidebarClasses = `
    fixed top-0 left-0 z-40 h-screen bg-[#0F1115] border-r border-[#2E3442]
    transition-all duration-300 flex flex-col
    ${isCollapsed ? 'w-20' : 'w-64'}
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
  `;

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[#171A21] border border-[#2E3442] text-[#F5F1EA]"
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2E3442] h-16">
          {!isCollapsed && (
            <Link to="/nexora-admin/dashboard" className="flex items-center gap-2">
              <img
                src="/assets/nexora-logo-ivory.png"
                alt="NEXORA"
                className="h-7 w-auto object-contain"
              />
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#A7AEBB]">STUDIO</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 text-[#A7AEBB] hover:text-[#F5F1EA] transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {ADMIN_NAV_LINKS.map((link) => {
            const Icon = iconMap[link.icon] || LayoutDashboard;
            const isActive = location.pathname === link.href;

            return (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-xs font-medium tracking-wider uppercase transition-all duration-200 rounded ${
                  isActive
                    ? 'bg-[#D7B98E]/12 text-[#D7B98E] border-l-2 border-[#D7B98E]'
                    : 'text-[#A7AEBB] hover:text-[#F5F1EA] hover:bg-[#231D1A]'
                }`}
                title={isCollapsed ? link.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Store + Logout */}
        <div className="p-2 border-t border-[#2E3442] space-y-1">
          <Link
            to="/"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-xs font-medium tracking-wider uppercase text-[#A7AEBB] hover:text-[#D7B98E] hover:bg-[#171A21] transition-all rounded"
          >
            <ExternalLink className="w-4 h-4" />
            {!isCollapsed && <span>View Store</span>}
          </Link>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-xs font-medium tracking-wider uppercase text-[#A7AEBB] hover:text-[#D7B98E] hover:bg-[#171A21] transition-all rounded"
          >
            <ExternalLink className="w-4 h-4" />
            {!isCollapsed && <span>Close Studio</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
