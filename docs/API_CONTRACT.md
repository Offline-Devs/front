# قرارداد قطعی ارتباط فرانت و بک‌اند

<!-- نسخه ۱؛ استخراج‌شده از router، handler، model و integration testهای backend در ۱۴۰۵/۰۳/۳۱. -->

## مسیر شبکه در محیط‌ها

مرورگر در تمام محیط‌ها فقط same-origin path زیر را مصرف می‌کند:

```text
/api/v1/*
```

Route Handler در Next مسیر را بدون prefix به backend می‌فرستد. آدرس داخلی backend فقط با `API_BASE_URL` در process سرور تعریف می‌شود و وارد JavaScript مرورگر نمی‌شود.

| محیط | آدرس مرورگر | `API_BASE_URL` سرور Next |
| --- | --- | --- |
| توسعه محلی | `http://localhost:3000/api/v1` | `http://localhost:8080` |
| Docker محلی | `http://localhost/api/v1` | `http://host.docker.internal:8080` |
| Staging | `https://staging.example.com/api/v1` | آدرس داخلی سرویس staging |
| Production | `https://example.com/api/v1` | آدرس داخلی و TLSدار backend production |

`API_TIMEOUT_MS` پیش‌فرض ۱۵ ثانیه است. خطای اتصال به 502 و timeout به 504 با همان شکل استاندارد خطا تبدیل می‌شود.

## شکل پاسخ

- خطا: `{ "error": string }`.
- list صفحه‌دار دانش‌آموزان: `{ "data": T[], "total": number, "page": number, "limit": number }`.
- عملیات ساده: `{ "status": "updated|deleted|approved|published" }`.
- سایر create/get/listها مدل یا آرایه مستقیم برمی‌گردانند.

لیست machine-readable تمام endpointها در `contracts/endpoints.ts` و fixtureهای typed در `mocks/fixtures` قرار دارند.

## جدول رفتار HTTP در UI

| status | رفتار فرانت | retry |
| --- | --- | --- |
| 400/422 | نمایش validation یا پیام درخواست نامعتبر | خیر |
| 401 | یک بار refresh؛ در شکست، پاک‌سازی session و ورود مجدد | فقط refresh |
| 403 | صفحه/پیام عدم دسترسی؛ برای inactive پیام اختصاصی | خیر |
| 404 | resource not found؛ فقط profile به onboarding هدایت می‌شود | خیر |
| 409 | نمایش conflict و دریافت دوباره resource | خیر |
| 429 | پیام محدودیت و رعایت زمان انتظار | با اقدام کاربر |
| 500/502/503/504 | حفظ state فرم، پیام قابل retry و ثبت monitoring | بله، کنترل‌شده |

پیاده‌سازی اجرایی این جدول در `services/api/error-catalog.ts` است؛ UI نباید متن انگلیسی خام backend را نشان دهد.

## تاریخ و فایل

- تمام ورودی‌های جلالی قبل از ارسال به `YYYY/MM/DD` تبدیل می‌شوند.
- `PerformanceHistory.files` و `DynamicFieldDefinition.options` رشته JSON هستند و باید با fallback امن parse شوند.
- URLهای نسبی `/uploads/*` با `resolveUploadUrl` از gateway عبور می‌کنند.
- profile: حداکثر 10MB؛ document: حداکثر 50MB؛ multiple: حداکثر ده فایل.

## versioning

نسخه public gateway فعلی `v1` است. تغییر breaking در مدل یا semantics باید با نسخه جدید یا migration هماهنگ انجام شود؛ تغییر خام response در همان نسخه مجاز نیست.
