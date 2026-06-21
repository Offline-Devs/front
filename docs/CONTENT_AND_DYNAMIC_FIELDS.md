# مدیریت محتوا و فیلدهای پویا

## مقاله‌ها

- فهرست مدیر همه draftها و مقاله‌های منتشرشده را با filter وضعیت نشان می‌دهد.
- editor عنوان، slug فارسی/لاتین، HTML محدود و وضعیت انتشار را مدیریت می‌کند.
- slug فاصله‌ها را به `-` تبدیل می‌کند و قبل از ارسال normalize می‌شود.
- preview و صفحه عمومی هر دو از allowlist واحد `sanitizeArticleHtml` استفاده می‌کنند.
- script، event handler و schemeهای خطرناک پیش از `dangerouslySetInnerHTML` حذف می‌شوند.
- ویرایش مستقیم صفحه با دریافت مجدد admin list کار می‌کند؛ backend هنوز endpoint مستقل `GET /admin/blog/:id` ندارد.

## کش مقاله

- mutation موفق queryهای public/admin مرتبط را invalidate می‌کند.
- route داخلی `/api/cache/public-blog` فقط برای session مدیر و درخواست same-origin قابل اجراست.
- route پس از create/update/publish/delete، tag سروری `public-blog` را revalidate می‌کند.
- sitemap، صفحه خانه، فهرست و جزئیات مقاله در چرخه revalidation بعدی داده جدید می‌گیرند.

## تعریف فیلد پویا

- CRUD تعریف‌های `student`، `exam` و `mistake` به endpointهای admin متصل است.
- نام فنی فقط lowercase لاتین، عدد و `_` می‌پذیرد.
- نوع‌های text، number، select، checkbox و date پشتیبانی می‌شوند.
- options نوع select باید JSON معتبر و آرایه غیرخالی از string باشد؛ سایر نوع‌ها options خالی ارسال می‌کنند.
- حذف definition مقادیر قدیمی JSON رکوردها را پاک نمی‌کند و UI پیش از حذف هشدار می‌دهد.

## renderer مشترک

- `DynamicFieldsSection` و `DynamicFieldRenderer` در profile، exam و mistake مشترک‌اند.
- requiredها در runtime پیش از mutation کنترل و مقادیر زیر `dynamic_fields[name]` ارسال می‌شوند.
- options با parser دارای fallback امن خوانده می‌شوند.
- client برای endpoint پیشنهادی `GET /dynamic-fields?entity_type=` آماده است.

## محدودیت backend

backend فعلی فقط `GET /admin/dynamic-fields` دارد و آن endpoint برای role دانش‌آموز مجاز نیست. بنابراین مدیریت تعریف‌ها کامل است، اما نمایش runtime آن‌ها برای دانش‌آموز تا اضافه‌شدن endpoint read-only احراز‌شده، به empty state امن fallback می‌کند. این محدودیت در `BACKEND_DECISIONS.md` نیز blocker انتشار فیلد پویا ثبت شده است.
