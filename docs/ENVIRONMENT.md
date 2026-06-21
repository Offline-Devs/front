# راهنمای متغیرهای محیطی فرانت

<!-- مرجع نگهداری و استقرار envها؛ فهرست قابل کپی در ریشه پروژه داخل .env.example است. -->

## فایل‌های پیشنهادی

- توسعه شخصی: `.env.local`؛ در Git ثبت نمی‌شود.
- CI build: متغیرهای `NEXT_PUBLIC_*` از تنظیمات pipeline.
- Staging/production runtime: متغیرهای سروری از secret manager یا orchestrator.
- Docker Compose: فایل `.env` کنار compose صرفاً برای substitution و خارج از Git.

## مرز امنیتی

هر متغیری با `NEXT_PUBLIC_` داخل JavaScript مرورگر قابل مشاهده است. token، password، connection string، آدرس خصوصی backend و session secret نباید این پیشوند را داشته باشند.

متغیرهای `BFF_*` و `API_BASE_URL` فقط در process سرور Next خوانده می‌شوند. `BFF_SESSION_SECRET` باید حداقل ۳۲ کاراکتر تصادفی باشد و در secret manager نگهداری شود.

## زمان اعمال تغییر

- `NEXT_PUBLIC_*`: زمان build؛ پس از تغییر باید frontend دوباره build/deploy شود.
- `API_*`، `APP_ENV`، `LOG_LEVEL` و `BFF_*`: زمان اجرای container؛ restart کافی است.

## تنظیمات اجباری production

پیش از انتشار این مقادیر باید صریحاً تنظیم شوند:

```dotenv
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_SITE_URL=https://example.com
NEXT_PUBLIC_ENABLE_QUERY_DEVTOOLS=false
APP_ENV=production
API_BASE_URL=https://internal-api.example.com
BFF_SESSION_COOKIE_SECURE=true
BFF_SESSION_SECRET=<secret-manager-reference>
```

## اعتبارسنجی

`config/env.ts` متغیرهای public و `config/server-env.ts` متغیرهای server را با Zod بررسی می‌کنند. URL نامعتبر، عدد خارج از بازه یا boolean غیر از `true/false` باید build یا startup را متوقف کند؛ fallbackها فقط برای توسعه محلی هستند.

## هماهنگی با backend

محدودیت آپلود، timeout و page size در env فرانت صرفاً محدودیت زودهنگام UI هستند. backend همچنان منبع امنیت و validation نهایی است و تغییر محدودیت backend باید هم‌زمان در env استقرار فرانت اعمال شود.
