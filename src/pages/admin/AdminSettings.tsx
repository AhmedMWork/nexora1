// ============================================================
// NEXORA — Admin Settings Page
// ============================================================

import { useEffect, useState } from 'react';
import { Settings, Truck, Palette, Save } from 'lucide-react';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import toast from 'react-hot-toast';

interface StoreSettings {
  storeName: string;
  currency: string;
  shippingFee: number;
  freeShippingThreshold: number;
  whatsappNumber: string;
  instagram: string;
  facebook: string;
  primaryColor: string;
  accentColor: string;
}

const initialSettings: StoreSettings = {
  storeName: 'NEXORA',
  currency: 'EGP',
  shippingFee: SHIPPING_FEE,
  freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  whatsappNumber: '201020304050',
  instagram: '@nexora.eg',
  facebook: 'NEXORA Egypt',
  primaryColor: '#050505',
  accentColor: '#c8a96a',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'shipping' | 'appearance'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSettings = async () => {
      try {
        const { getSiteSettings } = await import('@/lib/supabase/db');
        const currentSettings = await getSiteSettings();

        if (!mounted || !currentSettings) return;

        setSettings({
          storeName: currentSettings.storeName || initialSettings.storeName,
          currency: currentSettings.currency || initialSettings.currency,
          shippingFee: currentSettings.shippingFee ?? initialSettings.shippingFee,
          freeShippingThreshold: currentSettings.freeShippingThreshold ?? initialSettings.freeShippingThreshold,
          whatsappNumber: currentSettings.whatsappNumber || initialSettings.whatsappNumber,
          instagram: currentSettings.socialLinks?.instagram || initialSettings.instagram,
          facebook: currentSettings.socialLinks?.facebook || initialSettings.facebook,
          primaryColor: currentSettings.primaryColor || initialSettings.primaryColor,
          accentColor: currentSettings.accentColor || initialSettings.accentColor,
        });
      } catch {
        toast.error('Could not load store settings');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { updateSiteSettings } = await import('@/lib/supabase/db');
      await updateSiteSettings({
        storeName: settings.storeName,
        logo: '/assets/nexora-logo.png',
        favicon: '/favicon.ico',
        primaryColor: settings.primaryColor,
        accentColor: settings.accentColor,
        currency: settings.currency,
        shippingFee: settings.shippingFee,
        freeShippingThreshold: settings.freeShippingThreshold,
        taxRate: 0,
        whatsappNumber: settings.whatsappNumber,
        socialLinks: {
          instagram: settings.instagram,
          facebook: settings.facebook,
        },
        seo: {
          title: 'NEXORA | Premium Summer Essentials',
          description: 'Premium summer essentials and t-shirts for men and women.',
          keywords: 'nexora, fashion, t-shirts, egypt, premium streetwear',
        },
        announcements: [],
      });
      toast.success('Settings saved successfully');
    } catch {
      toast.error('Could not save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general' as const, label: 'General', icon: Settings },
    { id: 'shipping' as const, label: 'Shipping', icon: Truck },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold tracking-wider uppercase text-[#f4f0e8]">Settings</h1>
        <p className="text-xs text-[#8a8175] mt-1">{isLoading ? 'Loading settings...' : 'Configure your store'}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#17171a]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-xs tracking-wider uppercase transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'text-[#c8a96a] border-[#c8a96a]'
                : 'text-[#8a8175] border-transparent hover:text-[#b8b0a3]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="p-6 bg-[#0b0b0d] border border-[#17171a] space-y-5 max-w-2xl">
          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Store Name</label>
            <input
              value={settings.storeName}
              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
              className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
              className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]"
            >
              <option value="EGP">EGP (Egyptian Pound)</option>
              <option value="USD">USD (US Dollar)</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">WhatsApp Number</label>
            <input
              value={settings.whatsappNumber}
              onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Instagram</label>
              <input
                value={settings.instagram}
                onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Facebook</label>
              <input
                value={settings.facebook}
                onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Shipping Settings */}
      {activeTab === 'shipping' && (
        <div className="p-6 bg-[#0b0b0d] border border-[#17171a] space-y-5 max-w-2xl">
          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Shipping Fee (EGP)</label>
            <input
              type="number"
              value={settings.shippingFee}
              onChange={(e) => setSettings({ ...settings, shippingFee: Number(e.target.value) })}
              className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]"
            />
          </div>
          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Free Shipping Threshold (EGP)</label>
            <input
              type="number"
              value={settings.freeShippingThreshold}
              onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
              className="w-full bg-[#050505] border border-[#202024] px-4 py-3 text-sm text-[#f4f0e8] focus:outline-none focus:border-[#c8a96a]"
            />
          </div>
        </div>
      )}

      {/* Appearance Settings */}
      {activeTab === 'appearance' && (
        <div className="p-6 bg-[#0b0b0d] border border-[#17171a] space-y-5 max-w-2xl">
          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                className="w-12 h-10 bg-transparent border border-[#202024]"
              />
              <span className="text-xs text-[#b8b0a3]">{settings.primaryColor}</span>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-[#8a8175] uppercase tracking-wider mb-1.5 block">Accent Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                className="w-12 h-10 bg-transparent border border-[#202024]"
              />
              <span className="text-xs text-[#b8b0a3]">{settings.accentColor}</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="nexora-button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save className="w-3.5 h-3.5" />
        {isSaving ? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
}
