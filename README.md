<div dir="rtl" align="right">

<p dir="rtl" align="right">
  <strong>راهنمای پروژه:</strong>
  <a href="docs/USER_FLOWS.md">جریان کاربران</a> ·
  <a href="docs/TECHNICAL_ARCHITECTURE.md">معماری فنی</a> ·
  <a href="docs/API_INTEGRATION.md">ارتباط API</a> ·
  <a href="docs/OPERATIONS.md">عملیات</a> ·
  <a href="docs/SECURITY_AND_QUALITY.md">امنیت و کیفیت</a>
</p>

---

# 🎓 فرانت‌اند آکادمی نوشیروانی

<p dir="rtl" align="right">
  <strong>سامانه یکپارچه ثبت آزمون، تحلیل اشتباهات، مشاهده پیشرفت و مشاوره تحصیلی</strong><br />
  فارسی، راست‌چین، امن و آماده اجرای production
</p>

---

وب‌اپلیکیشن فارسی و راست‌چین آکادمی نوشیروانی برای مدیریت آزمون‌ها، تحلیل اشتباهات، گزارش‌های عملکرد
تحصیلی و مدیریت دانش‌آموزان. این برنامه فقط با تنظیمات محیط production اجرا می‌شود.

## فناوری‌های اصلی

<ul dir="rtl" align="right">
  <li dir="rtl" align="right">Next.js 16 با App Router، React 19 و TypeScript در حالت strict</li>
  <li dir="rtl" align="right">Tailwind CSS 4 به همراه فونت متغیر وزیرمتن با میزبانی آفلاین</li>
  <li dir="rtl" align="right">TanStack Query برای داده‌های سرور و Zustand برای وضعیت احراز هویت بدون نگهداری توکن</li>
  <li dir="rtl" align="right">React Hook Form و Zod برای فرم‌های type-safe و اعتبارسنجی داده‌ها</li>
  <li dir="rtl" align="right">کامپوننت‌های Radix UI، آیکن‌های Lucide، نمودارهای Recharts و اعلان‌های Sonner</li>
  <li dir="rtl" align="right">نشست رمزنگاری‌شده BFF در کوکی HttpOnly؛ توکن دسترسی و refresh هیچ‌گاه وارد مرورگر نمی‌شوند</li>
  <li dir="rtl" align="right">Vitest، Testing Library، MSW، Playwright و axe-core برای تست خودکار</li>
</ul>

## اجرای کامل سامانه

Docker روش استاندارد اجرای پروژه است. دستورهای زیر را از پوشه frontend اجرا کنید:

```bash
docker compose up --build -d
docker compose ps
```

سامانه از نشانی `http://localhost` در دسترس خواهد بود. Compose سرویس‌های PostgreSQL، Redis، بک‌اند
Go، فرانت‌اند Next.js و gateway مبتنی بر Nginx را اجرا می‌کند.

برای توقف سرویس‌ها:

```bash
docker compose down
```

گزینه `-v` را فقط زمانی اضافه کنید که حذف کامل داده‌های پایگاه داده، Redis و فایل‌های آپلودشده مدنظر
باشد.

## گیت کنترل کیفیت

```bash
npm ci
npm run quality
```

این دستور کنترل فرمت، typecheck، ESLint، تست‌های خودکار، build محیط production، بودجه عملکرد و
سناریوهای E2E دسکتاپ و موبایل را اجرا می‌کند.

## مستندات

<ul dir="rtl" align="right">
  <li dir="rtl" align="right"><a href="docs/USER_FLOWS.md">جریان‌های کامل کاربران</a></li>
  <li dir="rtl" align="right"><a href="docs/TECHNICAL_ARCHITECTURE.md">معماری فنی</a></li>
  <li dir="rtl" align="right"><a href="docs/API_INTEGRATION.md">ارتباط با API</a></li>
  <li dir="rtl" align="right"><a href="docs/OPERATIONS.md">عملیات و Docker</a></li>
  <li dir="rtl" align="right"><a href="docs/SECURITY_AND_QUALITY.md">امنیت و کنترل کیفیت</a></li>
</ul>

حالت اجرایی برنامه همواره production است. متغیرهای محیطی فقط مقادیر وابسته به استقرار را تنظیم
می‌کنند و امکان تغییر رفتار برنامه به development یا test را ندارند.

---

<p dir="rtl" align="right"><strong>وضعیت مستندات:</strong> هماهنگ با پیاده‌سازی فعلی frontend و backend</p>

</div>
