<div dir="rtl" align="right">

# امنیت و کنترل کیفیت

## کنترل‌های امنیتی

<ul dir="rtl" align="right">
  <li dir="rtl" align="right">نشست رمزنگاری‌شده JWE داخل کوکی HttpOnly و SameSite مانع دسترسی JavaScript به توکن‌ها می‌شود.</li>
  <li dir="rtl" align="right">بررسی same-origin از routeهای mutation در BFF محافظت می‌کند.</li>
  <li dir="rtl" align="right">CSP منبع script، style، تصویر، فونت، اتصال شبکه، فرم، frame و object را محدود می‌کند.</li>
  <li dir="rtl" align="right">Referrer Policy، جلوگیری از MIME sniffing، جلوگیری از نمایش داخل frame، محدودیت permissionهای مرورگر و opener isolation به‌صورت سراسری اعمال می‌شوند.</li>
  <li dir="rtl" align="right">پاک‌سازی HTML مقالات و escape کردن JSON-LD مانع اجرای محتوای غیرقابل‌اعتماد می‌شود.</li>
  <li dir="rtl" align="right">policy آپلود، metadata و signature باینری فایل را قبل از ارسال به بک‌اند کنترل می‌کند.</li>
  <li dir="rtl" align="right">telemetry فقط فیلدهای مجاز را می‌پذیرد و PII، اطلاعات درخواست، credential و stack trace را ثبت نمی‌کند.</li>
</ul>

## لایه‌های تست خودکار

<ul dir="rtl" align="right">
  <li dir="rtl" align="right">تست‌های Unit برای schemaها، formatterها، تبدیل تاریخ جلالی، mapperها، helperهای کش، رمزنگاری نشست، policy آپلود و نگاشت خطا</li>
  <li dir="rtl" align="right">تست‌های Component برای فرم‌ها، جدول‌های asynchronous، dialogها و primitiveهای رابط کاربری</li>
  <li dir="rtl" align="right">تست‌های Integration مبتنی بر MSW برای رفتار featureها در مرز transport مرورگر</li>
  <li dir="rtl" align="right">تست‌های Playwright برای مسیرهای حیاتی دانش‌آموز و مدیر در دسکتاپ و viewport موبایل</li>
  <li dir="rtl" align="right">تست‌های axe-core برای خطاهای مهم WCAG A/AA به همراه بررسی keyboard focus و reduced motion</li>
</ul>

## گیت الزامی

دستور `npm run quality` باید قبل از merge یا deploy موفق باشد. CI همین دستور را روی Node.js 22 و
نسخه pinشده Chromium مربوط به Playwright تکرار می‌کند.

این گیت شامل مراحل زیر است:

۱. بررسی فرمت تمام فایل‌ها با Prettier

۲. typecheck در حالت strict

۳. تحلیل ESLint

۴. اجرای تست‌های Unit، Component و Integration

۵. ساخت کامل production

۶. بررسی بودجه عملکرد

۷. اجرای E2E دسکتاپ و موبایل

بودجه عملکرد در صورت عبور حجم JavaScript اولیه gzipشده، یک تصویر عمومی یا مجموع فونت‌ها از سقف
تعیین‌شده build را متوقف می‌کند. افزایش سقف فقط باید با دلیل معماری مستند انجام شود و جایگزین بررسی
رشد bundle نیست.

## سیاست dependency

هر dependency زمان اجرا باید import واقعی در کد production داشته باشد. ابزارهای تست و build در
`devDependencies` قرار می‌گیرند. هنگام پاک‌سازی ساختاری باید `npx knip` اجرا شود و قبل از حذف، entry
pointهای قراردادی framework به‌صورت دستی بازبینی شوند؛ زیرا فایل‌های convention-based یا
subprocessهای Playwright ممکن است در گراف import ایستا دیده نشوند.

</div>
