<div dir="rtl" align="right">

# معماری فنی

## نمای کلی سامانه

مرورگر فقط با origin مربوط به Next.js ارتباط دارد. Next.js علاوه بر ارائه routeهای رابط کاربری، نقش
Backend-for-Frontend یا BFF را دارد و از طریق شبکه خصوصی Docker به API نوشته‌شده با Go متصل می‌شود.
PostgreSQL داده‌های دائمی را نگهداری می‌کند، Redis برای rate limit و وضعیت موقت بک‌اند استفاده
می‌شود و فایل‌های آپلودی داخل volume مستقل قرار می‌گیرند.

```text
مرورگر ← Nginx Gateway ← Next.js App Router / BFF ← Go API ← PostgreSQL
                                     │                 ├── Redis
                                     │                 └── Upload Volume
                                     └── Encrypted HttpOnly Session Cookie
```

## فناوری‌ها و دلایل استفاده

- **Next.js 16 App Router:** فراهم‌کردن Server Component، layoutهای تو‌در‌تو، route handler،
  metadata، caching و خروجی standalone برای production
- **React 19:** پیاده‌سازی بخش‌های تعاملی به‌صورت client island و نگه‌داشتن page و layoutها به‌عنوان
  Server Component در حالت پیش‌فرض
- **TypeScript strict:** بررسی ایستای کد برنامه، تست‌ها، تنظیمات و route handlerها
- **Tailwind CSS 4:** تولید utility classها و حفظ design tokenهای مشترک
- **Radix UI:** فراهم‌کردن رفتار دسترس‌پذیر برای dialog، select، tabs و checkbox
- **وزیرمتن:** فونت آفلاین با subset فارسی و لاتین، فرمت WOFF2، ویژگی `font-display: swap` و کش
  immutable

## ساختار سورس

<table dir="rtl" align="right">
  <thead>
    <tr>
      <th align="right">مسیر</th>
      <th align="right">مسئولیت</th>
    </tr>
  </thead>
  <tbody>
    <tr><td><code>app/</code></td><td>routeها، layoutها، metadata، boundaryهای loading/error و route handlerهای BFF</td></tr>
    <tr><td><code>components/</code></td><td>کامپوننت‌های feature، layout مشترک، providerها و primitiveهای UI</td></tr>
    <tr><td><code>config/</code></td><td>parse و اعتبارسنجی تنظیمات عمومی و server-only استقرار</td></tr>
    <tr><td><code>lib/</code></td><td>helperهای مستقل و کد server-only نشست، authorization و انتقال درخواست به بک‌اند</td></tr>
    <tr><td><code>schemas/</code></td><td>قراردادهای اعتبارسنجی و normalize کردن ورودی با Zod</td></tr>
    <tr><td><code>services/api/</code></td><td>ماژول‌های API مرورگر، query key، خطاها و invalidation هدفمند</td></tr>
    <tr><td><code>services/server/</code></td><td>خواندن cacheشده محتوای عمومی در سمت سرور</td></tr>
    <tr><td><code>services/mappers/</code></td><td>تبدیل مدل ذخیره‌سازی بک‌اند به view model موردنیاز فرانت‌اند</td></tr>
    <tr><td><code>stores/</code></td><td>حداقل وضعیت احراز هویت مرورگر بدون token یا داده تکراری API</td></tr>
    <tr><td><code>types/</code></td><td>قراردادهای TypeScript منطبق با مدل‌های domain و API بک‌اند</td></tr>
    <tr><td><code>tests/</code></td><td>تست‌های Integration مبتنی بر MSW و تست‌های E2E مبتنی بر Playwright</td></tr>
  </tbody>
</table>

## مدل rendering

صفحات عمومی تا حد ممکن با Static Generation و revalidation زمان‌بندی‌شده تولید می‌شوند. فهرست و
جزئیات مقالات از cache tag استفاده می‌کنند تا mutationهای مدیر فقط داده عمومی مقاله را invalidate
کنند. صفحات احرازشده dynamic هستند، زیرا layout سمت سرور باید پیش از render کوکی نشست و role کاربر
را بررسی کند.

Client Componentها به فرم‌ها، جدول‌های تعاملی، dialogها، providerهای مرورگر و نمودارها محدود
شده‌اند. کتابخانه Recharts فقط در route آمار با dynamic import بارگیری می‌شود. تمام providerهای
سراسری در یک client boundary قرار دارند تا سایر routeها به‌صورت Server Component باقی بمانند.

## معماری احراز هویت و BFF

مرورگر عملیات OTP را به routeهای هم‌مبدأ زیر `/api/auth` ارسال می‌کند. پاسخ تأیید OTP شامل access و
refresh token بک‌اند است، اما route handler این نشست را پیش از ساخت کوکی HttpOnly با JWE رمزنگاری
می‌کند. فقط مدل غیرحساس کاربر در state مرورگر قرار می‌گیرد.

layoutهای محافظت‌شده guardهای server-only را اجرا می‌کنند. proxy فراگیر `/api/v1/[...path]` مراحل
زیر را انجام می‌دهد:

۱. بررسی origin عمومی با درنظرگرفتن reverse proxy

۲. حذف cookie، authorization، host و هدرهای hop-by-hop ورودی

۳. رمزگشایی نشست در سرور و اضافه‌کردن access token به درخواست بک‌اند

۴. refresh پیش‌دستانه توکن نزدیک به انقضا

۵. اشتراک یک درخواست refresh بین درخواست‌های هم‌زمان یک نشست

۶. تکرار فقط یک‌باره درخواست بعد از refresh موفق

۷. بازگرداندن فقط هدرهای مجاز پاسخ به مرورگر

پاسخ routeهای API دارای `no-store` است تا اطلاعات شخصی داخل cache عمومی ذخیره نشود.

## معماری داده و کش

TanStack Query تنها محل نگهداری server state در مرورگر است. query-key factoryها namespace پایدار
entityها را تولید می‌کنند. mutationها به‌جای پاک‌کردن کل cache فقط list، detail و summary وابسته را
invalidate می‌کنند.

تنظیمات عمومی stale time، garbage collection، تعداد retry و refetch هنگام focus از environment معتبر
خوانده می‌شوند. Zustand فقط وضعیت قابل‌نمایش احراز هویت را نگه می‌دارد و هیچ رکورد بک‌اند یا
credential در آن ذخیره نمی‌شود. logout بین tabها با BroadcastChannel و fallback مبتنی بر storage
همگام می‌شود.

سیاست کش سمت سرور:

- صفحات marketing به‌صورت static تولید می‌شوند.
- مقالات revalidation پنج‌دقیقه‌ای و cache tag اختصاصی دارند.
- majors و subjects به‌دلیل تغییر کم از revalidation طولانی استفاده می‌کنند.
- تمام درخواست‌های احرازشده بک‌اند با `no-store` اجرا می‌شوند.

## فرم‌ها و اعتبارسنجی

React Hook Form چرخه فرم را بدون render مجدد کل صفحه در هر ورودی مدیریت می‌کند. schemaهای Zod موارد
زیر را ارائه می‌کنند:

- type مستقل ورودی و خروجی normalizeشده
- پیام اعتبارسنجی فارسی
- کنترل سازگاری عددهای آزمون
- normalize کردن اعداد فارسی و عربی
- بررسی قالب تاریخ جلالی
- اعتبارسنجی JSON گزینه‌های فیلد پویا

تعریف، renderer و validator فیلدهای پویا بین پروفایل، آزمون و اشتباه مشترک است. تعریف‌های بک‌اند
منبع اصلی حقیقت باقی می‌مانند و اعتبارسنجی فرانت‌اند فقط تجربه کاربری را بهبود می‌دهد.

## امنیت محتوا و آپلود

HTML مقاله با allow list محدود برای tag، attribute و scheme آدرس پاک‌سازی می‌شود. لینک‌های خارجی
مقدار امن `rel` دریافت می‌کنند. JSON-LD پیش از ورود به script element نویسه‌های HTML را escape
می‌کند.

فایل‌های پروفایل و اسناد ابتدا در فرم و سپس در BFF بررسی می‌شوند. کنترل BFF شامل موارد زیر است:

- multipart بودن payload
- معتبر بودن نوع عملیات upload
- تعداد فایل‌ها
- حجم کل payload و حجم هر فایل
- MIME type دقیق بر اساس allow list
- magic signature واقعی JPEG، PNG، WebP یا PDF

این کنترل‌ها جایگزین validation بک‌اند نیستند و یک لایه دفاعی مستقل ایجاد می‌کنند.

## مشاهده‌پذیری

مرورگر metricهای LCP، CLS و INP را با `navigator.sendBeacon` ارسال می‌کند. error boundaryهای React
فقط نام خطا، مسیر بدون query parameter و digest غیرقابل‌تفسیر را گزارش می‌کنند.

route مربوط به `/api/telemetry` فقط JSON هم‌مبدأ با حداکثر حجم ۲ کیلوبایت را می‌پذیرد، فیلدها را با
allow list محدود می‌کند و خروجی ساختاریافته container را بدون header، stack trace، token یا مشخصات
کاربر می‌نویسد.

## کنترل عملکرد

build محیط production شامل compression، فرمت‌های AVIF و WebP، React strict mode، خروجی standalone و
کش immutable فونت است. script پس از build بودجه‌های زیر را کنترل می‌کند:

- مجموع JavaScript اولیه به‌صورت gzip
- حجم هر تصویر عمومی
- مجموع حجم فونت‌ها

هدف‌های runtime عبارت‌اند از LCP کمتر از ۲٫۵ ثانیه، CLS کمتر از ۰٫۱ و INP کمتر از ۲۰۰ میلی‌ثانیه روی
موبایل میان‌رده.

## حالت ثابت production

برنامه environment selector ندارد. تنظیمات سمت سرور همیشه رفتار production را ارائه می‌کنند، secret
نشست در runtime اجباری است، حالت خودکار کوکی از Secure استفاده می‌کند و packageهای مخصوص runtime
توسعه حذف شده‌اند.

در بررسی محلی Docker می‌توان ویژگی Secure کوکی را به‌صورت صریح غیرفعال کرد، زیرا gateway محلی روی
HTTP اجرا می‌شود. این متغیر فقط ویژگی transport را تنظیم می‌کند و mode برنامه را از production تغییر
نمی‌دهد.

</div>
