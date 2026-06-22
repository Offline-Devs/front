<div dir="rtl" align="right">

<p dir="rtl" align="right">
  <a href="../README.md">خانه مستندات</a> ·
  <a href="USER_FLOWS.md">جریان کاربران</a> ·
  <a href="API_INTEGRATION.md">ارتباط API</a> ·
  <a href="OPERATIONS.md">عملیات</a> ·
  <a href="SECURITY_AND_QUALITY.md">امنیت و کیفیت</a>
</p>

---

# 🧩 معماری فنی فرانت‌اند

<p dir="rtl" align="right"><strong>مرجع ابزارها، لایه‌ها، جریان داده، امنیت، تست و استقرار پروژه</strong></p>

---

این سند مرجع فنی پیاده‌سازی فرانت‌اند است. در هر بخش مشخص شده است که چه ابزاری استفاده شده، آن ابزار
چه مسئله‌ای را حل می‌کند، در کدام قسمت پروژه قرار دارد و چگونه با سایر اجزای سامانه ارتباط برقرار
می‌کند.

## تصویر کلی سامانه

مرورگر مستقیماً به بک‌اند دسترسی ندارد. تمام ترافیک ابتدا وارد Nginx می‌شود، سپس به برنامه Next.js
می‌رسد. Next.js هم صفحه‌های رابط کاربری را ارائه می‌کند و هم به‌عنوان BFF درخواست‌های مرورگر را به
بک‌اند Go منتقل می‌کند.

```text
مرورگر کاربر
    ← Nginx Gateway
        ← Next.js App Router و BFF
            ← Go HTTP API
                ← PostgreSQL
                ← Redis
                ← Upload Volume

مرورگر ← کوکی نشست رمزنگاری‌شده و HttpOnly ← Next.js BFF
```

## ابزارهای هسته برنامه

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right">
    <tr dir="rtl" align="right">
      <th dir="rtl" align="right"><div dir="rtl" align="right">ابزار</div></th>
      <th dir="rtl" align="right"><div dir="rtl" align="right">نسخه اصلی</div></th>
      <th dir="rtl" align="right"><div dir="rtl" align="right">کاربرد دقیق در پروژه</div></th>
      <th dir="rtl" align="right"><div dir="rtl" align="right">محل استفاده</div></th>
    </tr>
  </thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><strong>Next.js</strong></td><td>16</td><td>مسیریابی، Server Component، Client Component، layout، metadata، route handlerهای BFF، کش سمت سرور، تولید static page و خروجی standalone</td><td><code>app/</code>، <code>next.config.ts</code> و <code>services/server/</code></td></tr>
    <tr dir="rtl" align="right"><td><strong>React</strong></td><td>19</td><td>ساخت رابط کاربری، مدیریت state محلی، effectها، فرم‌های تعاملی و boundaryهای خطا</td><td>تمام فایل‌های <code>tsx</code> در <code>components/</code> و routeهای تعاملی</td></tr>
    <tr dir="rtl" align="right"><td><strong>React DOM</strong></td><td>19</td><td>لایه render مرورگر که توسط Next.js استفاده می‌شود؛ مستقیماً در featureها مدیریت نمی‌شود</td><td>وابستگی runtime فریم‌ورک</td></tr>
    <tr dir="rtl" align="right"><td><strong>TypeScript</strong></td><td>5</td><td>کنترل type در حالت strict برای payloadهای API، props، فرم‌ها، mapperها، تست‌ها و تنظیمات</td><td><code>types/</code>، <code>tsconfig.json</code> و تمام فایل‌های <code>ts/tsx</code></td></tr>
    <tr dir="rtl" align="right"><td><strong>server-only</strong></td><td>0.0.1</td><td>جلوگیری از import تصادفی کد حساس سرور مانند secret نشست و backend client در bundle مرورگر</td><td><code>config/server-env.ts</code> و فایل‌های <code>lib/server/</code></td></tr>
  </tbody>
</table>

<br />

## مسیریابی و مدل render در Next.js

پروژه از App Router استفاده می‌کند. هر پوشه داخل `app/` یک بخش از URL یا یک route group است. route
groupهای داخل پرانتز URL جدیدی تولید نمی‌کنند و فقط برای جداسازی layoutها به کار می‌روند.

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">بخش</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">مسئولیت</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">نوع render</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><code>app/(public)</code></td><td>خانه، خدمات، درباره ما، تماس و مقالات عمومی</td><td>Static Generation یا server cache با revalidation</td></tr>
    <tr dir="rtl" align="right"><td><code>app/(auth)</code></td><td>ورود، OTP و تکمیل پروفایل</td><td>Dynamic و وابسته به وضعیت نشست</td></tr>
    <tr dir="rtl" align="right"><td><code>app/(student)</code></td><td>داشبورد، آزمون‌ها، اشتباهات، آمار، عملکرد و پروفایل</td><td>Dynamic با guard سمت سرور</td></tr>
    <tr dir="rtl" align="right"><td><code>app/(admin)</code></td><td>مدیریت دانش‌آموز، مقاله، گزارش و فیلد پویا</td><td>Dynamic با guard نقش مدیر</td></tr>
    <tr dir="rtl" align="right"><td><code>app/api</code></td><td>route handlerهای احراز هویت، proxy، telemetry و revalidation</td><td>فقط سمت سرور و بدون render UI</td></tr>
  </tbody>
</table>

<br />

Server Component حالت پیش‌فرض است. فقط فایل‌هایی که به event مرورگر، hookهای React، state تعاملی یا
APIهای مرورگر نیاز دارند با عبارت `"use client"` به Client Component تبدیل می‌شوند. این تصمیم حجم
JavaScript مرورگر را کم و امنیت داده‌های سمت سرور را بیشتر می‌کند.

صفحه‌های عمومی تا حد ممکن پیش‌تولید می‌شوند. مقاله‌ها revalidation پنج‌دقیقه‌ای و cache tag دارند.
اطلاعات رشته و درس به‌دلیل تغییر کم، کش طولانی‌تری دارد. صفحه‌های احرازشده همیشه اطلاعات کاربر را با
`no-store` دریافت می‌کنند.

## ابزارهای استایل و رابط کاربری

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">ابزار</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">کاربرد دقیق</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">نکته پیاده‌سازی</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><strong>Tailwind CSS 4</strong></td><td>layout، spacing، رنگ، breakpoint، typography و stateهای تعاملی</td><td>design tokenها در <code>app/globals.css</code> تعریف شده‌اند و componentها فقط utility class مصرف می‌کنند</td></tr>
    <tr dir="rtl" align="right"><td><strong>PostCSS</strong></td><td>اجرای compiler مربوط به Tailwind در build</td><td>تنظیمات در <code>postcss.config.mjs</code> قرار دارد</td></tr>
    <tr dir="rtl" align="right"><td><strong>class-variance-authority</strong></td><td>تعریف variantهای type-safe برای componentهایی مانند Button و Badge</td><td>variant، size و state در یک تعریف مرکزی نگهداری می‌شوند</td></tr>
    <tr dir="rtl" align="right"><td><strong>clsx</strong></td><td>ترکیب شرطی classها</td><td>از طریق helper مشترک <code>cn</code> مصرف می‌شود</td></tr>
    <tr dir="rtl" align="right"><td><strong>tailwind-merge</strong></td><td>حذف utility classهای متناقض Tailwind</td><td>داخل <code>lib/cn.ts</code> بعد از clsx اجرا می‌شود</td></tr>
    <tr dir="rtl" align="right"><td><strong>Lucide React</strong></td><td>آیکن‌های رابط کاربری</td><td>هر آیکن به‌صورت named import وارد می‌شود تا tree shaking حفظ شود</td></tr>
    <tr dir="rtl" align="right"><td><strong>Sonner</strong></td><td>نمایش toast موفقیت و خطای عملیات</td><td>Toaster فقط یک بار در provider سراسری mount می‌شود</td></tr>
    <tr dir="rtl" align="right"><td><strong>وزیرمتن</strong></td><td>نمایش خوانای فارسی و عددهای فارسی</td><td>subset فارسی و لاتین با WOFF2، حالت variable، بارگذاری آفلاین و کش immutable</td></tr>
  </tbody>
</table>

<br />

رابط کاربری از ابتدا با `dir="rtl"` و زبان `fa` ساخته شده است. classهای منطقی مانند `ms` و `me`
به‌جای جهت‌های ثابت چپ و راست استفاده می‌شوند. متن فنی یا شماره تلفن در صورت نیاز با `dir="ltr"` یا
`bdi` از متن فارسی جدا می‌شود.

## primitiveهای دسترس‌پذیر Radix UI

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">package</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">کامپوننت پروژه</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">مسئولیت</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><code>@radix-ui/react-dialog</code></td><td>Modal، Drawer و ConfirmDialog</td><td>focus trap، بازگشت focus، Escape، portal و attributeهای دسترس‌پذیری</td></tr>
    <tr dir="rtl" align="right"><td><code>@radix-ui/react-select</code></td><td>Select</td><td>ناوبری keyboard، انتخاب گزینه، focus و popup دسترس‌پذیر</td></tr>
    <tr dir="rtl" align="right"><td><code>@radix-ui/react-tabs</code></td><td>Tabs</td><td>تعویض tab با keyboard و ارتباط معنایی tab و panel</td></tr>
    <tr dir="rtl" align="right"><td><code>@radix-ui/react-checkbox</code></td><td>Checkbox</td><td>حالت checked و indeterminate به همراه keyboard interaction</td></tr>
    <tr dir="rtl" align="right"><td><code>@radix-ui/react-slot</code></td><td>ویژگی <code>asChild</code></td><td>انتقال رفتار و style کامپوننت به Link یا element فرزند بدون wrapper اضافه</td></tr>
  </tbody>
</table>

<br />

primitiveهای پروژه داخل `components/ui/` قرار دارند. featureها مستقیماً Radix را import نمی‌کنند تا
style، رفتار RTL و قرارداد accessibility فقط در یک نقطه مدیریت شود.

## فرم، اعتبارسنجی و تبدیل داده

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">ابزار</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">نقش</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">محل استفاده</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><strong>React Hook Form</strong></td><td>ثبت inputها، مدیریت dirty/error/submitting و کاهش renderهای غیرضروری</td><td>فرم ورود، پروفایل، آزمون، اشتباه، مقاله، گزارش و فیلد پویا</td></tr>
    <tr dir="rtl" align="right"><td><strong>Zod</strong></td><td>اعتبارسنجی runtime، normalize ورودی و تولید type ورودی/خروجی</td><td>تمام فایل‌های <code>schemas/</code> و parserهای environment</td></tr>
    <tr dir="rtl" align="right"><td><strong>@hookform/resolvers</strong></td><td>اتصال schemaهای Zod به React Hook Form</td><td>resolver تمام فرم‌های type-safe</td></tr>
  </tbody>
</table>

<br />

schemaهای فرم عددهای فارسی و عربی را normalize می‌کنند، تاریخ جلالی را به قالب ثابت `YYYY/MM/DD`
می‌برند، سازگاری تعداد سؤال‌های آزمون را بررسی می‌کنند و JSON گزینه‌های فیلد پویا را پیش از ارسال
کنترل می‌کنند.

لایه `services/mappers/` تفاوت مدل ذخیره‌سازی بک‌اند و مدل قابل‌استفاده UI را جدا می‌کند. برای
نمونه، attachmentهای گزارش که در بک‌اند به‌صورت رشته JSON ذخیره شده‌اند، قبل از ورود به component به
آرایه URL تبدیل می‌شوند.

## مدیریت داده و state

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">ابزار</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">چه داده‌ای را نگه می‌دارد؟</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">چه داده‌ای را نگه نمی‌دارد؟</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><strong>TanStack Query</strong></td><td>داده‌های remote مانند پروفایل، آزمون، اشتباه، آمار و فهرست مدیر</td><td>توکن و state صرفاً نمایشی component</td></tr>
    <tr dir="rtl" align="right"><td><strong>Zustand</strong></td><td>کاربر قابل‌نمایش و وضعیت authenticated یا unauthenticated</td><td>توکن، رکوردهای API و داده تکراری TanStack Query</td></tr>
    <tr dir="rtl" align="right"><td><strong>React state</strong></td><td>بازبودن dialog، ردیف در حال ویرایش و ورودی موقت UI</td><td>داده اشتراکی سرور</td></tr>
    <tr dir="rtl" align="right"><td><strong>URL Search Params</strong></td><td>صفحه، فیلتر تأیید و بازه تاریخ آمار</td><td>اطلاعات حساس یا draft فرم</td></tr>
  </tbody>
</table>

<br />

query keyها در `services/api/query-keys.ts` متمرکز هستند. هر mutation فقط dependencyهای واقعی خود را
invalidate می‌کند. برای مثال ثبت آزمون، فهرست آزمون، داشبورد و آمار را refresh می‌کند، اما cache
مقاله یا پروفایل مدیر را تغییر نمی‌دهد.

## احراز هویت، نشست و رمزنگاری

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">ابزار یا مکانیزم</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">کاربرد</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><strong>jose</strong></td><td>رمزنگاری و رمزگشایی نشست با JWE؛ access token و refresh token داخل متن قابل‌خواندن کوکی قرار نمی‌گیرند</td></tr>
    <tr dir="rtl" align="right"><td><strong>HttpOnly Cookie</strong></td><td>جلوگیری از دسترسی JavaScript مرورگر به credential</td></tr>
    <tr dir="rtl" align="right"><td><strong>SameSite</strong></td><td>کاهش ریسک ارسال کوکی در درخواست cross-site</td></tr>
    <tr dir="rtl" align="right"><td><strong>Secure</strong></td><td>محدودکردن کوکی به HTTPS در استقرار واقعی</td></tr>
    <tr dir="rtl" align="right"><td><strong>BroadcastChannel</strong></td><td>همگام‌کردن logout و تغییر نشست بین tabهای مرورگر</td></tr>
  </tbody>
</table>

<br />

مرورگر عملیات OTP را به `/api/auth` می‌فرستد. BFF توکن‌های پاسخ بک‌اند را رمزنگاری و فقط user
غیرحساس را به مرورگر برمی‌گرداند. proxy مسیر `/api/v1/[...path]` کوکی را می‌خواند، access token را
سمت سرور به درخواست اضافه می‌کند و در صورت نزدیک‌بودن انقضا refresh انجام می‌دهد.

درخواست‌های هم‌زمان یک نشست از refresh مشترک استفاده می‌کنند تا چند refresh token هم‌زمان مصرف نشود.
پاسخ نهایی 401 نشست را پاک می‌کند. layoutهای student و admin پیش از render نقش و وضعیت پروفایل را
بررسی می‌کنند.

## امنیت محتوا، شبکه و فایل

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">ابزار یا کنترل</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">مسئله‌ای که حل می‌کند</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><strong>sanitize-html</strong></td><td>حذف tag، attribute و scheme ناامن از مقاله قبل از استفاده در <code>dangerouslySetInnerHTML</code></td></tr>
    <tr dir="rtl" align="right"><td><strong>CSP</strong></td><td>محدودکردن منبع script، style، تصویر، فونت، اتصال، form action و frame</td></tr>
    <tr dir="rtl" align="right"><td><strong>Origin Validation</strong></td><td>رد mutationهای cross-origin با پشتیبانی صحیح از reverse proxy</td></tr>
    <tr dir="rtl" align="right"><td><strong>Upload Policy</strong></td><td>بررسی multipart، تعداد، حجم، MIME و magic signature فایل در BFF</td></tr>
    <tr dir="rtl" align="right"><td><strong>Header Allow List</strong></td><td>جلوگیری از عبور cookie، authorization و headerهای hop-by-hop مرورگر به بک‌اند</td></tr>
    <tr dir="rtl" align="right"><td><strong>server-only</strong></td><td>جلوگیری از ورود backend URL، session secret و کد رمزگشایی به bundle مرورگر</td></tr>
  </tbody>
</table>

<br />

JSON-LD نویسه `<` را escape می‌کند. لینک مقاله مقدار امن `rel` دریافت می‌کند. telemetry اجازه ارسال
header، stack trace، token، ایمیل، تلفن یا نام کاربر را ندارد.

## نمودار و نمایش داده

Recharts فقط در صفحه آمار و با dynamic import بارگیری می‌شود. این کتابخانه نمودار روند آزمون، عملکرد
درس‌ها و دلایل اشتباه را می‌سازد. هر نمودار یک جدول HTML معادل دارد تا اطلاعات بدون دیدن رنگ یا شکل
نمودار و با screen reader نیز قابل‌استفاده باشد.

محاسبات مشتق مانند مرتب‌سازی داده نمودار و مجموع دلایل اشتباه با `useMemo` انجام می‌شوند. کتابخانه
نمودار وارد routeهای دیگر نمی‌شود و در JavaScript اولیه صفحه خانه حضور ندارد.

## مشاهده‌پذیری و عملکرد

Web Vitals داخلی Next.js مقدار LCP، CLS و INP را جمع‌آوری می‌کند. داده با `navigator.sendBeacon` به
`/api/telemetry` فرستاده می‌شود. error boundary فقط نام خطا، مسیر بدون query string و digest را
ارسال می‌کند.

endpoint مربوط به telemetry حداکثر ۲ کیلوبایت JSON هم‌مبدأ می‌پذیرد و بعد از allow-list کردن فیلدها،
log ساختاریافته تولید می‌کند. هیچ داده هویتی یا credential ثبت نمی‌شود.

script موجود در `scripts/check-performance-budgets.mjs` بعد از build حجم JavaScript اولیه gzip،
تک‌تصویرها و مجموع فونت‌ها را اندازه می‌گیرد. build در صورت عبور از سقف متوقف می‌شود. هدف عملیاتی
LCP کمتر از ۲٫۵ ثانیه، CLS کمتر از ۰٫۱ و INP کمتر از ۲۰۰ میلی‌ثانیه است.

## ابزارهای تست و تضمین کیفیت

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">ابزار</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">کاربرد دقیق</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><strong>Vitest</strong></td><td>runner تست‌های Unit، Component و Integration با پشتیبانی TypeScript و اجرای سریع</td></tr>
    <tr dir="rtl" align="right"><td><strong>@vitejs/plugin-react</strong></td><td>تبدیل JSX در محیط Vitest</td></tr>
    <tr dir="rtl" align="right"><td><strong>jsdom</strong></td><td>شبیه‌سازی DOM مرورگر برای تست component در Node.js</td></tr>
    <tr dir="rtl" align="right"><td><strong>Testing Library</strong></td><td>تعامل با UI بر اساس role، label و رفتار قابل‌مشاهده کاربر</td></tr>
    <tr dir="rtl" align="right"><td><strong>jest-dom</strong></td><td>matcherهای خوانا برای attribute، دسترس‌پذیری، حضور و disabled بودن element</td></tr>
    <tr dir="rtl" align="right"><td><strong>user-event</strong></td><td>شبیه‌سازی کلیک، تایپ و keyboard interaction نزدیک به رفتار واقعی کاربر</td></tr>
    <tr dir="rtl" align="right"><td><strong>MSW</strong></td><td>mock کردن API در سطح network برای تست Integration بدون تغییر کد feature</td></tr>
    <tr dir="rtl" align="right"><td><strong>Playwright</strong></td><td>اجرای جریان کامل ورود، onboarding، آزمون، اشتباه، تأیید مدیر و مقاله روی Chromium دسکتاپ و موبایل</td></tr>
    <tr dir="rtl" align="right"><td><strong>axe-core</strong></td><td>بررسی خودکار خطاهای مهم WCAG در صفحه‌های عمومی و احراز هویت</td></tr>
    <tr dir="rtl" align="right"><td><strong>ESLint</strong></td><td>کنترل خطاهای کدنویسی و ruleهای مخصوص React و Next.js</td></tr>
    <tr dir="rtl" align="right"><td><strong>Prettier</strong></td><td>فرمت یکپارچه TypeScript، TSX، JavaScript، JSON، CSS، YAML و Markdown</td></tr>
    <tr dir="rtl" align="right"><td><strong>Knip</strong></td><td>شناسایی فایل، dependency و export بدون مصرف</td></tr>
  </tbody>
</table>

<br />

دستور `npm run quality` به‌ترتیب فرمت، typecheck، lint، تست‌ها، build، بودجه عملکرد و E2E را اجرا
می‌کند. workflow موجود در `.github/workflows/quality.yml` همین گیت را روی Node.js 22 تکرار می‌کند.

## زیرساخت و اجرای production

Dockerfile فرانت‌اند سه stage دارد. stage اول dependencyها را با `npm ci` نصب می‌کند. stage دوم
build production را می‌سازد. stage سوم فقط خروجی standalone، assetهای static و فایل‌های public را
داخل image نهایی Node.js 22 Alpine کپی می‌کند و برنامه را با کاربر غیر root اجرا می‌کند.

Docker Compose پنج سرویس دارد: PostgreSQL، Redis، backend، web و gateway. فقط پورت ۸۰ gateway روی
میزبان منتشر می‌شود. frontend با نام DNS داخلی `backend` به API وصل می‌شود. health checkها از شروع
سرویس وابسته پیش از آماده‌شدن dependency جلوگیری می‌کنند.

Nginx فشرده‌سازی gzip، cache assetهای immutable، forwarding هدرهای proxy و محدودیت حجم درخواست را
مدیریت می‌کند. Next.js نیز compression، security headerها، image formatهای AVIF/WebP و خروجی
standalone را تنظیم می‌کند.

## ساختار پوشه‌ها

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right"><tr dir="rtl" align="right"><th dir="rtl" align="right"><div dir="rtl" align="right">پوشه</div></th><th dir="rtl" align="right"><div dir="rtl" align="right">محتوا</div></th></tr></thead>
  <tbody dir="rtl" align="right">
    <tr dir="rtl" align="right"><td><code>app/</code></td><td>route، layout، metadata، error/loading boundary و API route</td></tr>
    <tr dir="rtl" align="right"><td><code>components/admin/</code></td><td>داشبورد مدیر، جدول دانش‌آموز، پرونده و فیلد پویا</td></tr>
    <tr dir="rtl" align="right"><td><code>components/auth/</code></td><td>فرم شماره، OTP و bootstrap نشست</td></tr>
    <tr dir="rtl" align="right"><td><code>components/exams/</code></td><td>فرم، فهرست، جزئیات و ردیف درس آزمون</td></tr>
    <tr dir="rtl" align="right"><td><code>components/mistakes/</code></td><td>ثبت، ویرایش، جست‌وجو و حذف اشتباه</td></tr>
    <tr dir="rtl" align="right"><td><code>components/statistics/</code></td><td>فیلتر آمار، summary، نمودار و جدول جایگزین</td></tr>
    <tr dir="rtl" align="right"><td><code>components/ui/</code></td><td>primitiveهای reusable و دسترس‌پذیر</td></tr>
    <tr dir="rtl" align="right"><td><code>config/</code></td><td>environment و navigation مرکزی</td></tr>
    <tr dir="rtl" align="right"><td><code>lib/server/</code></td><td>نشست، رمزنگاری، guard، backend client و helper route</td></tr>
    <tr dir="rtl" align="right"><td><code>schemas/</code></td><td>اعتبارسنجی فرم و normalize داده</td></tr>
    <tr dir="rtl" align="right"><td><code>services/api/</code></td><td>API client، endpoint module، query key و invalidation</td></tr>
    <tr dir="rtl" align="right"><td><code>services/mappers/</code></td><td>تبدیل مدل بک‌اند به view model</td></tr>
    <tr dir="rtl" align="right"><td><code>tests/</code></td><td>mock server، Integration و E2E</td></tr>
    <tr dir="rtl" align="right"><td><code>types/</code></td><td>قراردادهای domain و API</td></tr>
  </tbody>
</table>

<br />

## سیاست ثابت محیط اجرا

برنامه selector برای development، test یا staging ندارد و رفتار application همیشه production است.
secret نشست در runtime الزامی است و حالت خودکار کوکی Secure را فعال می‌کند. تنظیم
`BFF_SESSION_COOKIE_SECURE=false` در Docker محلی فقط به دلیل HTTP بودن localhost است و mode برنامه
را تغییر نمی‌دهد.

## محدودیت شناخته‌شده قرارداد فعلی بک‌اند

فرانت‌اند برای نمایش تعریف‌های فیلد پویا در فرم پروفایل، آزمون و اشتباه، endpoint احرازشده
`GET /dynamic-fields?entity_type=...` را در `services/api/dynamic-fields.api.ts` فراخوانی می‌کند.
بک‌اند فعلی فقط routeهای `/admin/dynamic-fields` را برای مدیریت تعریف‌ها دارد و route خواندنی
دانش‌آموز را ثبت نکرده است.

در نتیجه CRUD تعریف‌ها در پنل مدیر فعال است، اما مصرف آن‌ها در فرم دانش‌آموز تا اضافه‌شدن endpoint
خواندنی بک‌اند کامل نیست. renderer، mapper و validator فرانت‌اند برای این قابلیت پیاده‌سازی شده‌اند
و پس از تکمیل قرارداد بک‌اند بدون تغییر معماری قابل‌استفاده خواهند بود.

---

<p dir="rtl" align="right"><strong>اسناد مرتبط:</strong> <a href="USER_FLOWS.md">جریان کاربران</a> · <a href="API_INTEGRATION.md">ارتباط API</a> · <a href="OPERATIONS.md">عملیات و Docker</a></p>

</div>
