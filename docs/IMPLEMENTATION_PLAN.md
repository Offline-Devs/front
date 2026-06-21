# برنامه اجرایی پیاده‌سازی کامل فرانت

<!-- این برنامه مبنای اجرای مرحله‌ای UI است؛ هر فاز باید مستقل review و تایید شود. -->

## اصول ثابت پروژه

- زبان، پیام‌ها، validation و metadata کاملاً فارسی.
- `lang="fa"` و `dir="rtl"` در root؛ جهت‌های خاص فقط با CSS logical properties اصلاح شوند.
- Vazirmatn variable به‌صورت self-hosted و بدون درخواست خارجی.
- Server Component پیش‌فرض؛ Client Component فقط برای تعامل، فرم، chart و browser API.
- TanStack Query تنها مالک server-state و Zustand فقط برای session/UI state.
- طراحی mobile-first، دسترس‌پذیر و قابل استفاده با keyboard و screen reader.
- هیچ مقدار رشته، درس، role، وضعیت یا قرارداد API خارج از منابع مرکزی hard-code نشود.

## ✅ فاز ۰ — تثبیت قرارداد و پیش‌نیاز backend

خروجی:

- [x] نهایی‌کردن base URL در dev، Docker و production.
- [x] تصمیم قطعی درباره BFF و نگهداری refresh token در HttpOnly cookie.
- [x] اصلاح یا ثبت تصمیم برای refresh کاربر غیرفعال، موفقیت کاذب update/delete، مالکیت mistake و تاریخ جلالی.
- [x] مشخص‌کردن نیاز endpointهای مفقود: مقاله مدیر با ID، contact، اعلان و summary مدیر.
- [x] ساخت fixture واقعی برای تمام responseها و جدول status/error قابل نمایش به کاربر.

معیار پایان: قراردادهای فرانت و backend بدون ابهام و قابل تست باشند.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `API_CONTRACT.md`، `BACKEND_DECISIONS.md`، `contracts/endpoints.ts`، `mocks/fixtures` و same-origin gateway در `app/api/v1`.

## ✅ فاز ۱ — Design system فارسی و RTL

خروجی:

- [x] تعریف رنگ، spacing، radius، typography، shadow و breakpointها.
- [x] primitiveهای Button، Input، Select، Textarea، Checkbox، Radio، Card، Badge، Alert، Modal، Drawer، Tabs، Table، Pagination، Tooltip، Skeleton و Toast.
- [x] حالت‌های hover، focus-visible، disabled، loading، error و empty.
- [x] layout عمومی و پنل در موبایل، تبلت و دسکتاپ.
- [x] بررسی نمایش اعداد فارسی/لاتین، متن ترکیبی، شماره موبایل، تاریخ و URL در RTL.

معیار پایان: Story/demo داخلی تمام primitiveها و تست دسترس‌پذیری پایه.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `DESIGN_SYSTEM.md`، مسیر داخلی `/design-system`، primitiveهای `components/ui` و تست `design-system.test.tsx`.

## ✅ فاز ۲ — زیرساخت داده، session و خطا

خروجی:

- [x] BFF/session امن، refresh تک‌پروازه، logout کامل و پاک‌سازی cache خصوصی.
- [x] route guard برای guest/student/admin و redirect پروفایل ناقص.
- [x] mapperهای response، parse امن `files/options` و نرمال‌سازی تاریخ جلالی.
- [x] error boundary، toast، retry policy، offline state و صفحه 403/404/500.
- [x] query key factory و mutation invalidation دقیق برای هر feature.

معیار پایان: تست جریان 401/403/404/429، refresh همزمان و logout در چند tab.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `SESSION_AND_DATA.md`، routeهای `app/api/auth`، gateway در `app/api/v1`، guardهای `lib/server`، mapperها و ۱۷ تست خودکار.

## ✅ فاز ۳ — صفحات عمومی و SEO

خروجی:

- [x] خانه، خدمات، درباره ما، تماس، لیست مقاله و جزئیات مقاله.
- [x] header/footer responsive، navigation موبایل و CTAهای ورود.
- [x] metadata فارسی، Open Graph، robots، sitemap و structured data مقاله.
- [x] render امن محتوای مقاله و جلوگیری از XSS.

کش:

- [x] صفحات ثابت: prerender.
- [x] لیست و جزئیات blog: server cache با revalidation و tagهای invalidation.
- [x] majors/subjects: cache طولانی چون تغییر کمی دارند.

معیار پایان: صفحات عمومی در production build بدون وابستگی به دسترسی لحظه‌ای backend تولید شوند و تست امنیت محتوای مقاله پاس شود.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `PUBLIC_PAGES_AND_SEO.md`، مسیرهای عمومی `app/(public)`، داده‌های cache‌شده در `services/server/public-content.ts` و فایل‌های metadata در `app`.

## ✅ فاز ۴ — احراز هویت و onboarding

خروجی:

- [x] ورود شماره موبایل، OTP شش‌رقمی، paste/autofocus و شمارش ارسال مجدد.
- [x] مدیریت خطای rate limit و OTP منقضی.
- [x] تشخیص role و هدایت مدیر/دانش‌آموز.
- [x] تکمیل پروفایل، آپلود عکس، رشته، تاریخ جلالی و dynamic fields.

معیار پایان: جریان کامل کاربر جدید، کاربر موجود، کاربر غیرفعال و OTP اشتباه در موبایل/دسکتاپ.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `AUTH_AND_ONBOARDING.md`، صفحات `app/(auth)`، فرم‌های `components/auth` و `components/profile`، schemaهای احراز هویت/پروفایل و تست‌های خودکار جریان OTP.

## ✅ فاز ۵ — پنل دانش‌آموز: هسته عملیاتی

خروجی:

- [x] dashboard با وضعیت تایید، summary، آخرین آزمون‌ها و برنامه مطالعاتی.
- [x] CRUD آزمون با subject field array و validation سازگاری تعداد پاسخ‌ها.
- [x] CRUD دفترچه اشتباهات با انتخاب exam/subject متعلق به خود کاربر.
- [x] مشاهده/ویرایش پروفایل و آپلود عکس.
- [x] confirm عملیات destructive، optimistic UX فقط در عملیات قابل rollback.

کش:

- [x] dashboard/profile: stale کوتاه و invalidation پس از mutation مرتبط.
- [x] exams/mistakes: cache لیست و detail جدا و prefetch بومی Linkهای Next.
- [x] mutationها به‌جای refetch سراسری فقط entity و summary وابسته را invalidate کنند.

معیار پایان: dashboard و عملیات create/read/update/delete آزمون و اشتباه، همراه ویرایش پروفایل، در موبایل و دسکتاپ قابل استفاده و قراردادهای عددی آزمون پیش از ارسال کنترل شوند.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `STUDENT_CORE.md`، صفحات `app/(student)`، componentهای `dashboard`، `exams`، `mistakes` و تست schemaهای عملیاتی.

## ✅ فاز ۶ — آمار و عملکرد دانش‌آموز

خروجی:

- [x] summary cards، نمودار روند، عملکرد دروس و دلایل اشتباه.
- [x] فیلتر بازه جلالی با URL search params.
- [x] timeline برنامه مطالعاتی، یادداشت و فایل‌های مشاور.
- [x] fallback جدولی برای نمودارها و دسترس‌پذیری داده.

بهینه‌سازی: [x] Recharts با dynamic import، محاسبات مشتق با memoization و عدم ارسال کتابخانه chart در صفحات دیگر.

معیار پایان: آمار بازه‌دار با URL قابل اشتراک، نمودار و جدول هم‌ارز، و گزارش‌های مشاور همراه پیوست امن در موبایل و دسکتاپ قابل استفاده باشند.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `STUDENT_STATISTICS_AND_PERFORMANCE.md`، صفحات `/statistics` و `/performance`، componentهای `statistics` و `performance` و تست helperهای بازه.

## ✅ فاز ۷ — پنل مدیریت دانش‌آموزان

خروجی:

- [x] جدول صفحه‌دار با filter تایید، loading/empty/error و URL state.
- [x] پرونده کامل دانش‌آموز با profile، exams، mistakes، statistics و performance.
- [x] تایید/لغو تایید، ویرایش و حذف با سطح دسترسی و confirm.
- [x] ثبت/ویرایش/حذف گزارش، برنامه مطالعاتی و آپلود چند فایل.

معیار پایان: هیچ داده مدیر برای role دانش‌آموز render یا cache نشود.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `ADMIN_STUDENTS.md`، صفحات `app/(admin)/admin/students`، componentهای `components/admin` و فرم گزارش عملکرد.

## ✅ فاز ۸ — مدیریت محتوا و فیلدهای پویا

خروجی:

- [x] لیست draft/published، editor مقاله، preview، publish و delete.
- [x] slug فارسی/لاتین قابل کنترل و sanitization محتوا.
- [x] CRUD dynamic fields و validation JSON options.
- [x] renderer واحد dynamic fields در profile، exam و mistake.

کش: [x] publish/update/delete، cache عمومی blog و cache admin را هدفمند invalidate می‌کنند.

معیار پایان: چرخه کامل مدیریت مقاله و تعریف فیلد پویا بدون render محتوای خام ناامن اجرا شود؛ محدودیت endpoint خواندن تعریف‌ها برای دانش‌آموز صریح باقی بماند.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `CONTENT_AND_DYNAMIC_FIELDS.md`، صفحات مدیریت blog/dynamic-fields، route امن revalidation و renderer مشترک فرم‌ها.

## ✅ فاز ۹ — تست، کیفیت و دسترس‌پذیری

خروجی:

- [x] unit test برای formatter، mapper، schema، Jalali و API error handling.
- [x] component test برای فرم‌ها، modal، table و حالات async.
- [x] integration test با mock server برای featureهای اصلی.
- [x] E2E مسیرهای ورود، تکمیل پروفایل، آزمون، اشتباه، تایید مدیر و مقاله.
- [x] بررسی keyboard، focus order، contrast، reduced motion و screen reader.

گیت کیفیت: [x] typecheck، lint، unit، E2E smoke و production build در CI.

معیار پایان: گیت محلی و CI با mock backend تکرارپذیر، در viewport دسکتاپ و موبایل، بدون وابستگی به سرویس خارجی پاس شود.

وضعیت: تکمیل‌شده در ۱۴۰۵/۰۳/۳۱. مراجع اجرایی: `QUALITY_ASSURANCE.md`، workflow در `.github/workflows/quality.yml`، تنظیمات Playwright/MSW و تست‌های `tests/e2e` و `tests/integration`.

## فاز ۱۰ — Performance، امنیت و مشاهده‌پذیری

خروجی:

- تحلیل bundle و حذف dependency/Client Component غیرضروری.
- budgets برای JS، تصویر، فونت و Core Web Vitals.
- image optimization، lazy loading، prefetch کنترل‌شده و compression/cache headers.
- CSP، جلوگیری از XSS، محدودیت MIME/size upload و عدم log token/PII.
- error monitoring، Web Vitals و logging بدون اطلاعات حساس.

اهداف اولیه: LCP کمتر از ۲.۵ ثانیه، CLS کمتر از ۰.۱ و INP کمتر از ۲۰۰ میلی‌ثانیه روی موبایل میان‌رده.
