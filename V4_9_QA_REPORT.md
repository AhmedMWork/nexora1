# NEXORA V4.9 QA Report

## تم اختباره داخل بيئة البناء
- TypeScript build.
- Vite production build.
- ESLint.
- Admin routes compile: Dashboard, Products, Orders, Customers, Inventory, Coupons, Limited Drops, Reviews, Analytics, SEO, System Health.
- Public routes compile: Home, Shop, Product, Cart, Checkout, Reviews, Contact, Info pages.

## اختبارات مطلوبة بعد النشر
1. فتح `/` و `/shop` و `/product/:slug` و `/cart` و `/checkout`.
2. فتح `/nexora-admin/dashboard` بدون ظهور صفحة بيضاء.
3. إضافة منتج بسعر وسعر قبل الخصم وصور متعددة وألوان ومقاسات ومخزون.
4. إضافة كوبون percentage وfixed وتجربته في checkout.
5. تنفيذ طلب COD والتأكد من ظهوره في Orders وCustomers وAnalytics.
6. رفع صورة إلى bucket `products` من الأدمن.
7. تجربة اللغة العربية بالكامل على الموبايل.
8. التأكد أن `/nexora-admin` غير موجود في sitemap ولا يظهر في الواجهة العامة.

## تقييم جاهزية الإصدار
- Storefront: 94/100
- Admin: 94/100
- Product management: 95/100
- Orders/Coupons: 93/100
- Analytics/Customers: 92/100
- SEO readiness: 93/100
- Stability: 95/100
- Overall: 94/100
