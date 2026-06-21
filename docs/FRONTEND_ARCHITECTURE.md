# معماری فرانت

<!-- مرز مسئولیت پوشه‌ها و تصمیم‌های data flow این scaffold. -->

## لایه‌ها

- `app`: routing، layout و composition صفحه.
- `components`: componentهای دامنه‌ای و primitiveهای UI.
- `services/api`: تنها محل شناخت HTTP و pathهای backend.
- `types` و `schemas`: قرارداد response/input و validation.
- `hooks`: اتصال component به query/store.
- `stores`: فقط session و client UI state.
- `lib` و `config`: utility خالص و تنظیمات.

## state و cache

TanStack Query مالک server-state است؛ stale time پیش‌فرض 60 ثانیه و GC ده دقیقه است. mutationها باید فقط query key مرتبط را invalidate کنند و logout تمام cache خصوصی را پاک کند. Zustand فقط نشست و UI را نگه می‌دارد و داده API در آن کپی نمی‌شود.

scaffold token را persist نمی‌کند. برای production، BFF در Next و refresh token داخل HttpOnly/Secure/SameSite cookie توصیه می‌شود؛ localStorage برای refresh token مناسب نیست.

## rendering و بهینه‌سازی

- blog عمومی در نسخه نهایی Server Component با revalidation باشد.
- فرم، chart و mutation Client Component هستند.
- chart/editor/date-picker با dynamic import بارگیری شوند.
- pagination/filter در URL بمانند.
- تصاویر با `next/image` و origin backend تنظیم شوند.
- query client از refresh تک‌پروازه استفاده می‌کند تا 401های همزمان refresh stampede نسازند.

## جریان ورود

`login -> verify OTP -> role check -> profile check -> dashboard/admin`. اگر پروفایل دانش‌آموز 404 بود، مسیر `/complete-profile` نمایش داده می‌شود.
