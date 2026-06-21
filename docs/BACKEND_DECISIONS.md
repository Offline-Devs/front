# تصمیم‌ها و موارد هماهنگی بک‌اند

<!-- تصمیم‌های قطعی فاز قرارداد؛ موارد باز blocker فاز مربوطه هستند، نه ابهام پنهان در فرانت. -->

## تصمیم session و BFF

تصمیم قطعی: browser فقط با Next same-origin gateway ارتباط دارد. در فاز زیرساخت session، endpointهای auth روی همین مرز به BFF کامل تبدیل می‌شوند:

- refresh token فقط `HttpOnly + Secure + SameSite=Lax` cookie.
- access token در حافظه کوتاه‌عمر؛ هیچ token در localStorage ذخیره نمی‌شود.
- refresh تک‌پروازه و rotation/revocation در صورت پشتیبانی backend.
- logout تمام cookie، state و query cache خصوصی را پاک می‌کند.

تا اجرای فاز session، store حافظه‌ای فعلی صرفاً scaffold توسعه است و production-ready محسوب نمی‌شود.

## اشکالات ثبت‌شده و تصمیم مصرف‌کننده

| مورد backend | ریسک | تصمیم فرانت | اقدام لازم backend |
| --- | --- | --- | --- |
| refresh کاربر غیرفعال | امنیتی، زیاد | 403 verify را نمایش می‌دهیم؛ workaround قابل اتکا وجود ندارد | بررسی `is_active` در refresh |
| update/delete ID ناموجود = 200 | صحت داده، متوسط | پس از عملیات حساس query مرتبط invalidate می‌شود | بررسی `RowsAffected` و پاسخ 404 |
| عدم بررسی مالکیت mistake reference | integrity، متوسط | فقط exam/subject کاربر جاری قابل انتخاب است | validation مالکیت در create/update |
| تاریخ جلالی بدون zero-pad | آمار اشتباه، متوسط | همه تاریخ‌ها قبل از ارسال normalize می‌شوند | normalize در handler و DB |
| create blog = 200 | ناسازگاری، کم | هر 2xx موفق تلقی می‌شود | هماهنگی Swagger/handler روی 201 |
| role داخل JWT قدیمی | دسترسی، متوسط | access token کوتاه و logout اجباری در تغییر نقش | در صورت نیاز introspection/token version |

موارد امنیتی backend باید پیش از انتشار production رفع شوند؛ mitigation فرانت جایگزین authorization سمت سرور نیست.

## endpointهای مفقود

| نیاز | تصمیم فعلی | deadline |
| --- | --- | --- |
| `GET /admin/blog/:id` | edit موقتاً از cache لیست admin؛ refresh مستقیم صفحه پشتیبانی کامل ندارد | پیش از فاز مدیریت محتوا اضافه شود |
| contact form | در نسخه اول اطلاعات تماس/لینک مستقیم؛ فرم ارسال نمی‌شود | فقط در صورت نیاز محصول endpoint اضافه شود |
| notifications | خارج از scope نسخه اول؛ UI جعلی ساخته نمی‌شود | تصمیم محصول قبل از طراحی اعلان |
| admin dashboard summary | آمار محدود از `students/with-stats` مشتق می‌شود | پیش از حجم داده بالا endpoint aggregate اضافه شود |
| blog search/pagination | client filter فقط روی داده دریافت‌شده دقیق نیست | پیش از رشد محتوا query سروری اضافه شود |

## منبع حقیقت

اولویت رفع تعارض: `router.go`، سپس handler/model، سپس integration test و در آخر Swagger/README. هر تغییر backend باید هم‌زمان type، fixture، endpoint inventory و این سند را به‌روزرسانی کند.
