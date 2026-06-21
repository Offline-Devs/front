# تست، کیفیت و دسترس‌پذیری

## لایه‌های تست

- unit: schemaها، formatter، تاریخ جلالی، mapper، sanitization، session و helperهای cache.
- component: OTP، primitiveهای design system، modal، tabs، فرم فیلد پویا و جدول async مدیر.
- integration: MSW درخواست‌های gateway و mapping پاسخ featureها را بدون stub کردن لایه API بررسی می‌کند.
- E2E: Playwright، Next dev واقعی و mock backend مستقل را هم‌زمان اجرا می‌کند.

## مسیرهای E2E

- ورود دانش‌آموز با OTP و cookie واقعی BFF.
- تکمیل پروفایل و هدایت به dashboard.
- ثبت آزمون با درس و invariantهای پاسخ.
- ثبت دفترچه اشتباهات.
- ورود مدیر، مشاهده پرونده و تأیید دانش‌آموز.
- ساخت مقاله و مشاهده آن در فهرست مدیریت.
- تمام flowها در Desktop Chrome و Pixel 5 اجرا می‌شوند.

## دسترس‌پذیری

- axe-core در Chromium واقعی صفحات عمومی و ورود را با WCAG A/AA بررسی می‌کند.
- contrast واقعی CTA در همین فاز از ۴.۳ به حد مجاز اصلاح شد.
- نام دسترس‌پذیر Selectها و slug editor اصلاح شد.
- modal Escape/focus، tabs keyboard، label/error association و async table تست component دارند.
- reduced-motion با media emulation و computed style مرورگر تست می‌شود.

## اجرای محلی

- `npm run test`: unit، component و integration.
- `npm run test:e2e`: E2E دسکتاپ و موبایل؛ web serverها خودکار اجرا/متوقف می‌شوند.
- `npm run quality`: typecheck، lint، test، production build و E2E.
- نصب اولیه مرورگر: `npx playwright install chromium`.

## CI

workflow روی push به main و pull request اجرا می‌شود. Node 22، `npm ci` و Chromium به‌همراه dependencyهای سیستم نصب می‌شوند و سپس `npm run quality` اجرا می‌شود. شکست هر گیت مانع موفقیت job است.

## mock backend

mock فقط زیر `tests/e2e` است و در production bundle وارد نمی‌شود. state پیش از هر تست reset می‌شود، پروژه‌ها تک‌worker هستند و session/token همچنان توسط BFF واقعی فرانت ساخته می‌شود.
