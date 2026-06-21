# تحلیل بک‌اند برای پیاده‌سازی فرانت

<!-- در تعارض مستندات، router و handlerهای Go منبع حقیقت‌اند. -->

> قرارداد تثبیت‌شده محیط‌ها و رفتار HTTP در `API_CONTRACT.md` و تصمیم‌های هماهنگی در `BACKEND_DECISIONS.md` نگهداری می‌شوند.

## معماری و دسترسی

بک‌اند با Go/Gin، GORM/PostgreSQL، Redis برای OTP و JWT access/refresh ساخته شده است. routeها در root ثبت شده‌اند و prefix مانند `/api/v1` فقط ممکن است توسط reverse proxy اضافه شود. خطاها `{ "error": string }` هستند، ولی پاسخ موفق envelope یکسان ندارد.

- عمومی: OTP، blog منتشرشده، majors و subjects.
- احراز‌شده: profile، exams، mistakes، statistics، dashboard و upload.
- مدیر: دانش‌آموزان، performance، blog و dynamic fields.

پروفایل Student بعد از ورود جدا ساخته می‌شود؛ در نتیجه ورود موفق الزاماً به معنی وجود پروفایل نیست و `GET /students/profile` می‌تواند 404 بدهد.

## endpointها

| حوزه | عملیات |
| --- | --- |
| Auth | `POST /auth/request-otp`، `POST /auth/verify-otp`، `POST /auth/refresh` |
| Public | `GET /blog`، `GET /blog/:slug`، `GET /majors`، `GET /subjects?major=` |
| Profile | `GET/POST /students/profile` |
| Exams | `GET/POST /exams`، `GET/PUT/DELETE /exams/:id` |
| Mistakes | `GET/POST /mistakes`، `PUT/DELETE /mistakes/:id` |
| Analytics | `/students/dashboard`، `/students/statistics?from=&to=`، `/students/performance` |
| Upload | `POST /upload?type=`، `POST /upload/multiple?type=` |
| Admin | `/admin/students/*`، `/admin/performance/*`، `/admin/blog/*`، `/admin/dynamic-fields/*` |

## رفتارهای اثرگذار بر فرانت

- `PUT /exams/:id` آرایه subjects را کامل جایگزین می‌کند.
- `PerformanceHistory.files` و `DynamicFieldDefinition.options` رشته JSON هستند.
- تاریخ جلالی باید به `YYYY/MM/DD` نرمال شود؛ backend تاریخ را lexicographic فیلتر می‌کند.
- فقط students with-stats پاسخ `{data,total,page,limit}` دارد؛ اکثر لیست‌ها آرایه مستقیم‌اند.
- profile upload حداکثر 10MB، document حداکثر 50MB و multiple حداکثر 10 فایل است.
- رشته و درس باید از API خوانده شوند و hard-code نشوند.

## اشکالات فعلی backend

1. کاربر غیرفعال هنوز با refresh token می‌تواند access token بگیرد.
2. چند update/delete برای ID ناموجود هم 200 می‌دهند.
3. مالکیت exam/subject هنگام ثبت mistake بررسی نمی‌شود.
4. create مقاله مدیر برخلاف Swagger مقدار 200 می‌دهد.
5. role تا انقضای access token از JWT قبلی خوانده می‌شود.
6. GET مقاله مدیر با id وجود ندارد؛ edit باید از cache لیست استفاده کند.
7. endpoint تماس، اعلان، جست‌وجوی blog و داشبورد تجمیعی مدیر وجود ندارد.
