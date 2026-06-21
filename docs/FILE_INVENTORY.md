# فهرست فایل‌ها و بخش‌ها

<!-- checklist اجرای UI پس از مرحله scaffold. -->

## صفحات

- عمومی: `/`، `/about`، `/services`، `/contact`، `/blog`، `/blog/[slug]`.
- ورود: `/login`، `/verify-otp`، `/complete-profile`.
- دانش‌آموز: `/dashboard`، همه مسیرهای `/exams`، `/mistakes`، `/performance`، `/statistics`، `/profile`.
- مدیر: `/admin`، `/admin/students/*`، `/admin/blog/*`، `/admin/dynamic-fields`.

## componentها

- Layout: header/footer عمومی و dashboard shell/header/sidebar.
- Auth/Profile: phone، OTP، profile و dynamic fields.
- Exams/Mistakes: فرم، لیست، score row و summary.
- Analytics: summary، سه chart، timeline و performance form.
- Admin/Blog: students table، student overview، approval، dynamic-field CRUD و post editor.
- Shared/UI: button، input، card، modal، table، pagination، empty/status و uploader.
