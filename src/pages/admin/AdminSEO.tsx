import { CheckCircle2, Copy, SearchCheck, FileText, Globe2, PackageSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/constants';

const seoItems = [
  ['robots.txt', 'Allows public storefront crawling while blocking hidden admin routes.'],
  ['sitemap.xml', 'Includes home, shop, categories, limited, reviews, contact, and legal pages.'],
  ['site.webmanifest', 'Provides app identity, theme color, and icon metadata.'],
  ['Product JSON-LD ready', 'Product pages can expose price, image, availability, SKU, and brand.'],
  ['FAQ content ready', 'FAQ page copy can be submitted and extended for FAQ structured data.'],
  ['Admin noindex strategy', 'Admin is blocked from sitemap and robots and must not be linked publicly.'],
];

export default function AdminSEO() {
  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success('Copied');
  };

  const searchConsoleSteps = `1. Open Google Search Console\n2. Add URL prefix: ${SITE_URL}\n3. Download verification HTML file\n4. Replace public/google-site-verification.html\n5. Redeploy Vercel\n6. Submit sitemap: ${SITE_URL}/sitemap.xml`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#FFF0E1]">SEO & Google</h1>
        <p className="mt-1 text-sm text-[#BCAEA0]">Search-readiness hub for Google files, metadata, sitemap submission, and product discoverability.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="studio-card p-5 lg:col-span-2">
          <div className="mb-5 flex items-center gap-3"><SearchCheck className="h-5 w-5 text-[#D2B48C]" /><h2 className="text-sm font-semibold text-[#FFF0E1]">Current metadata</h2></div>
          <div className="space-y-3 text-sm text-[#BCAEA0]">
            <p><span className="text-[#FFF0E1]">Brand:</span> {SITE_NAME}</p>
            <p><span className="text-[#FFF0E1]">Canonical domain:</span> {SITE_URL}</p>
            <p><span className="text-[#FFF0E1]">Description:</span> {SITE_DESCRIPTION}</p>
          </div>
        </div>
        <button onClick={() => copy(searchConsoleSteps)} className="studio-card p-5 text-left transition hover:border-[#D2B48C]">
          <Copy className="mb-4 h-5 w-5 text-[#D2B48C]" />
          <h2 className="text-sm font-semibold text-[#FFF0E1]">Copy Google setup steps</h2>
          <p className="mt-2 text-xs leading-6 text-[#BCAEA0]">Use this when connecting the final domain to Google Search Console.</p>
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {seoItems.map(([title, helper]) => (
          <div key={title} className="studio-card p-5">
            <CheckCircle2 className="mb-4 h-5 w-5 text-emerald-300" />
            <h2 className="text-sm font-semibold text-[#FFF0E1]">{title}</h2>
            <p className="mt-2 text-xs leading-6 text-[#BCAEA0]">{helper}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="studio-card p-6"><FileText className="mb-3 h-5 w-5 text-[#D2B48C]" /><h2 className="text-sm font-semibold text-[#FFF0E1]">Content pages</h2><p className="mt-2 text-sm leading-7 text-[#BCAEA0]">FAQ, Shipping & Returns, Privacy, Terms, Contact, Reviews, and Limited pages are included in public navigation and sitemap.</p></div>
        <div className="studio-card p-6"><PackageSearch className="mb-3 h-5 w-5 text-[#D2B48C]" /><h2 className="text-sm font-semibold text-[#FFF0E1]">Product SEO</h2><p className="mt-2 text-sm leading-7 text-[#BCAEA0]">Add clear product names, SKU, multiple images, price, compare price, colors, stock, and SEO description from the Products manager.</p></div>
        <div className="studio-card p-6 lg:col-span-2"><Globe2 className="mb-3 h-5 w-5 text-[#D2B48C]" /><h2 className="text-sm font-semibold text-[#FFF0E1]">Final domain note</h2><p className="mt-2 text-sm leading-7 text-[#BCAEA0]">When you move from Vercel preview to a final custom domain, update SITE_URL in src/lib/constants.ts, sitemap.xml, robots.txt, Google docs, and Vercel environment references.</p></div>
      </div>
    </div>
  );
}
