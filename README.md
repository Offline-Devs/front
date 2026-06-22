<div dir="rtl" align="right">

# فرانت‌اند آکادمی نوشیروانی

وب‌اپلیکیشن فارسی و راست‌چین آکادمی نوشیروانی برای مدیریت آزمون‌ها، تحلیل اشتباهات، گزارش‌های عملکرد
تحصیلی و مدیریت دانش‌آموزان. این برنامه فقط با تنظیمات محیط production اجرا می‌شود.

## فناوری‌های اصلی

- Next.js 16 با App Router، React 19 و TypeScript در حالت strict
- Tailwind CSS 4 به همراه فونت متغیر وزیرمتن با میزبانی آفلاین
- TanStack Query برای داده‌های سرور و Zustand برای وضعیت احراز هویت بدون نگهداری توکن
- React Hook Form و Zod برای فرم‌های type-safe و اعتبارسنجی داده‌ها
- کامپوننت‌های Radix UI، آیکن‌های Lucide، نمودارهای Recharts و اعلان‌های Sonner
- نشست رمزنگاری‌شده BFF در کوکی HttpOnly؛ توکن دسترسی و refresh هیچ‌گاه وارد مرورگر نمی‌شوند
- Vitest، Testing Library، MSW، Playwright و axe-core برای تست خودکار

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

- [جریان‌های کامل کاربران](docs/USER_FLOWS.md)
- [معماری فنی](docs/TECHNICAL_ARCHITECTURE.md)
- [ارتباط با API](docs/API_INTEGRATION.md)
- [عملیات و Docker](docs/OPERATIONS.md)
- [امنیت و کنترل کیفیت](docs/SECURITY_AND_QUALITY.md)

حالت اجرایی برنامه همواره production است. متغیرهای محیطی فقط مقادیر وابسته به استقرار را تنظیم
می‌کنند و امکان تغییر رفتار برنامه به development یا test را ندارند.

</div>
