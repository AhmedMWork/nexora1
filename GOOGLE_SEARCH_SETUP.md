# NEXORA V4.1 — Google Search Setup

This package includes the technical files needed for Google discovery and indexing:

- `public/robots.txt`
- `public/sitemap.xml`
- `public/site.webmanifest`
- `public/google-site-verification.html` placeholder
- SEO metadata in `index.html`
- page-level Helmet metadata
- JSON-LD for Organization, FAQ, and product-ready pages

## 1. Verify the site in Google Search Console

1. Open Google Search Console.
2. Add the final domain, for example `https://nexora1-one.vercel.app/` or your custom domain.
3. Choose HTML file verification or meta tag verification.
4. If using HTML file verification, replace `public/google-site-verification.html` with the exact file downloaded from Google.
5. Redeploy the site on Vercel.
6. Click Verify in Search Console.

## 2. Submit the sitemap

After deployment, submit:

```txt
https://nexora1-one.vercel.app/sitemap.xml
```

If you use a custom domain, update `public/sitemap.xml`, `public/robots.txt`, and `index.html` canonical/og URL values before deployment.

## 3. Pages intentionally excluded

The following pages must not appear in Google search:

```txt
/studio
/nexora-admin
/admin

```

They are excluded from the sitemap and disallowed in `robots.txt`.

## 4. Before production

- Replace placeholder Google verification file.
- Update sitemap URLs to the final domain.
- Add final social links.
- Add real product descriptions and images.
- Make sure no internal/admin text is visible on customer pages.
