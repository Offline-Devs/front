<div dir="rtl" align="right">

<p dir="rtl" align="right">
  <a href="../README.md">خانه مستندات</a> ·
  <a href="USER_FLOWS.md">جریان کاربران</a> ·
  <a href="TECHNICAL_ARCHITECTURE.md">معماری فنی</a> ·
  <a href="OPERATIONS.md">عملیات</a> ·
  <a href="SECURITY_AND_QUALITY.md">امنیت و کیفیت</a>
</p>

---

# 🔌 ارتباط با API

<p dir="rtl" align="right"><strong>مرجع مسیرهای شبکه، BFF، مدیریت خطا و ابطال کش</strong></p>

---

## مرز شبکه

مرورگر تمام درخواست‌های عملیاتی را به مسیر `/api/v1` روی origin فرانت‌اند ارسال می‌کند. route فراگیر
BFF این مسیر را به آدرس خصوصی بک‌اند در `API_BASE_URL` نگاشت می‌کند. مقدار این متغیر در Docker برابر
`http://backend:8080` است و سرویس بک‌اند مستقیماً در اختیار مرورگر قرار نمی‌گیرد.

## منابع عمومی بک‌اند

<ul dir="rtl" align="right">
  <li dir="rtl" align="right"><code>GET /blog</code> و <code>GET /blog/:slug</code> محتوای مقالات منتشرشده را ارائه می‌کنند.</li>
  <li dir="rtl" align="right"><code>GET /majors</code> و <code>GET /subjects?major=...</code> اطلاعات مرجع رشته‌ها و درس‌ها را برمی‌گردانند.</li>
  <li dir="rtl" align="right"><code>POST /auth/request-otp</code>، <code>POST /auth/verify-otp</code> و <code>POST /auth/refresh</code> عملیات احراز هویت را انجام می‌دهند.</li>
</ul>

خواندن داده‌های عمومی در Server Componentها از `services/server/public-content.ts` انجام می‌شود.
عملیات تعاملی مرورگر همیشه از BFF هم‌مبدأ عبور می‌کنند.

## منابع دانش‌آموز

<ul dir="rtl" align="right">
  <li dir="rtl" align="right"><code>/students/profile</code>: ایجاد، خواندن و ویرایش پروفایل دانش‌آموز جاری</li>
  <li dir="rtl" align="right"><code>/students/dashboard</code>: وضعیت تأیید و خلاصه فعالیت‌های اخیر</li>
  <li dir="rtl" align="right"><code>/exams</code> و <code>/exams/:id</code>: عملیات CRUD آزمون‌های دانش‌آموز جاری</li>
  <li dir="rtl" align="right"><code>/mistakes</code> و <code>/mistakes/:id</code>: عملیات CRUD دفترچه اشتباهات</li>
  <li dir="rtl" align="right"><code>/students/statistics</code>: آمار دانش‌آموز با فیلتر اختیاری بازه تاریخ جلالی</li>
  <li dir="rtl" align="right"><code>/students/performance</code>: تاریخچه گزارش‌های مشاور به‌صورت فقط خواندنی</li>
  <li dir="rtl" align="right"><code>/upload</code> و <code>/upload/multiple</code>: آپلود احرازشده تصویر پروفایل یا اسناد</li>
</ul>

## منابع مدیر

<ul dir="rtl" align="right">
  <li dir="rtl" align="right"><code>/admin/students/with-stats</code>: فهرست صفحه‌بندی‌شده دانش‌آموزان همراه آمار</li>
  <li dir="rtl" align="right"><code>/admin/students/:id</code>: مشاهده و ویرایش پروفایل دانش‌آموز</li>
  <li dir="rtl" align="right"><code>/admin/students/:id/approve</code>: تغییر وضعیت تأیید دانش‌آموز</li>
  <li dir="rtl" align="right">زیرمنابع دانش‌آموز برای آزمون‌ها، اشتباهات، آمار و گزارش‌های عملکرد</li>
  <li dir="rtl" align="right"><code>/admin/blog</code>: چرخه کامل ایجاد، ویرایش، انتشار و حذف مقاله</li>
  <li dir="rtl" align="right"><code>/admin/dynamic-fields</code>: مدیریت تعریف فیلدهای پویا</li>
</ul>

## خط لوله درخواست

۱. ماژول feature تابع `apiRequest` را با مسیر نسبی API فراخوانی می‌کند.

۲. `apiRequest` پیشوند `NEXT_PUBLIC_API_BASE_PATH` را اضافه می‌کند، برای payloadهای JSON هدر مناسب
می‌سازد و credential هم‌مبدأ را ارسال می‌کند. برای `FormData` تعیین Content-Type به مرورگر واگذار
می‌شود.

۳. BFF در mutationها origin درخواست را اعتبارسنجی و هدرهای ناامن را حذف می‌کند.

۴. BFF کوکی نشست را رمزگشایی و Bearer token را فقط در سمت سرور به درخواست بک‌اند اضافه می‌کند.

۵. پاسخ بک‌اند با فهرست مجاز هدرها به مرورگر بازگردانده می‌شود.

۶. پاسخ 401 فقط یک بار باعث refresh توکن می‌شود. شکست نهایی refresh نشست را پاک می‌کند.

## مدیریت خطا

پاسخ‌های ناموفق به نمونه `ApiError` تبدیل می‌شوند. این کلاس status، کد پایدار، قابلیت retry و پیام
کنترل‌شده فارسی را نگهداری می‌کند. کامپوننت‌ها وضعیت‌های خطا، retry، empty و permission را به‌صورت
یکپارچه نمایش می‌دهند. متن خام خطای بک‌اند هیچ‌گاه مستقیماً وارد HTML نمی‌شود.

## ابطال کش

<ul dir="rtl" align="right">
  <li dir="rtl" align="right">mutation پروفایل، queryهای پروفایل و داشبورد را invalidate می‌کند.</li>
  <li dir="rtl" align="right">mutation آزمون، فهرست و جزئیات آزمون، خلاصه داشبورد و آمار را invalidate می‌کند.</li>
  <li dir="rtl" align="right">mutation اشتباه، فهرست اشتباهات و آمار وابسته را invalidate می‌کند.</li>
  <li dir="rtl" align="right">عملیات مدیر روی دانش‌آموز فقط رکورد و فهرست مرتبط را invalidate می‌کند.</li>
  <li dir="rtl" align="right">mutation مقاله queryهای مدیر را invalidate و revalidation کش عمومی را اجرا می‌کند.</li>
</ul>

## نگهداری قراردادها

مدل‌های JSON بک‌اند در `types/`، schemaهای mutation در `schemas/` و تبدیل تفاوت‌های ذخیره‌سازی در
`services/mappers/` قرار دارند. هنگام تغییر پاسخ بک‌اند باید type، mapper، handler مربوط به MSW،
fixture و تست integration هم‌زمان به‌روزرسانی شوند و سپس کامپوننت UI تغییر کند.

---

<p dir="rtl" align="right"><strong>اسناد مرتبط:</strong> <a href="TECHNICAL_ARCHITECTURE.md">معماری فنی</a> · <a href="OPERATIONS.md">عملیات و Docker</a></p>

</div>
