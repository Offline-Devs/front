# صفحات عمومی و SEO

## مسیرها

- `/`: معرفی محصول، خدمات، روند استفاده، آخرین مقاله‌ها و CTA.
- `/services`: خدمات و داده‌های رشته/درس دریافت‌شده از backend.
- `/about` و `/contact`: اطلاعات ثابت و راه‌های ارتباطی تنظیم‌پذیر.
- `/blog` و `/blog/[slug]`: فهرست و جزئیات مقاله با metadata پویا.

## دریافت داده و کش

- دریافت داده عمومی فقط در Server Component و از base URL سمت سرور انجام می‌شود.
- مقاله‌ها ۵ دقیقه و رشته‌ها/درس‌ها ۲۴ ساعت revalidate می‌شوند.
- tagهای `public-blog` و `public-majors` برای invalidation بعدی آماده‌اند.
- خطای موقت backend باعث شکست build نمی‌شود و به empty state امن تبدیل می‌شود.

## امنیت محتوا

- HTML مقاله پیش از render با allowlist پاک‌سازی می‌شود.
- script، event handler، URL خطرناک و attributeهای خارج از قرارداد حذف می‌شوند.
- JSON-LD پیش از تزریق در سند escape می‌شود.

## SEO و اشتراک‌گذاری

- metadata پایه، canonical، Open Graph و Twitter card در layout اصلی تعریف شده‌اند.
- جزئیات هر مقاله title، description، canonical و Article JSON-LD اختصاصی دارد.
- `robots.txt`، `sitemap.xml`، manifest و تصویر Open Graph به‌صورت route بومی Next تولید می‌شوند.
- تصویر Open Graph از فونت TTF آفلاین وزیرمتن استفاده می‌کند و هیچ وابستگی خارجی ندارد.

## متغیرهای محیطی مرتبط

نام، توضیح، URL، اطلاعات تماس و feature flagهای صفحات عمومی از متغیرهای مستندشده در `.env.example` خوانده می‌شوند. تغییر آن‌ها نیازمند ویرایش source نیست.
