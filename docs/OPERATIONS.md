<div dir="rtl" align="right">

<p dir="rtl" align="right">
  <a href="../README.md">خانه مستندات</a> ·
  <a href="USER_FLOWS.md">جریان کاربران</a> ·
  <a href="TECHNICAL_ARCHITECTURE.md">معماری فنی</a> ·
  <a href="API_INTEGRATION.md">ارتباط API</a> ·
  <a href="SECURITY_AND_QUALITY.md">امنیت و کیفیت</a>
</p>

---

# 🐳 عملیات و Docker

<p dir="rtl" align="right"><strong>راهنمای build، اجرا، health check، نگهداری داده و استقرار</strong></p>

---

## سرویس‌ها

فایل Compose موجود در frontend توپولوژی استاندارد اجرای محلی و integration سامانه است.

<table dir="rtl" width="100%">
  <thead dir="rtl" align="right">
    <tr>
      <th align="right">سرویس</th>
      <th align="right">مسئولیت</th>
      <th align="right">پورت منتشرشده</th>
    </tr>
  </thead>
  <tbody dir="rtl" align="right">
    <tr><td><code>postgres</code></td><td>پایگاه داده دائمی بک‌اند</td><td>ندارد</td></tr>
    <tr><td><code>redis</code></td><td>وضعیت موقت و rate limit بک‌اند</td><td>ندارد</td></tr>
    <tr><td><code>backend</code></td><td>API مبتنی بر Go</td><td>ندارد</td></tr>
    <tr><td><code>web</code></td><td>فرانت‌اند standalone و BFF مبتنی بر Next.js</td><td>ندارد</td></tr>
    <tr><td><code>gateway</code></td><td>reverse proxy عمومی مبتنی بر Nginx</td><td><code>80</code></td></tr>
  </tbody>
</table>

<br />

فقط gateway در شبکه میزبان منتشر می‌شود. health checkها ترتیب آماده‌شدن PostgreSQL و Redis، سپس
backend، frontend و gateway را کنترل می‌کنند.

## دستورهای اجرایی

```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f web backend
docker compose down
```

دستور `docker compose down -v` فقط برای reset مخرب و آگاهانه پایگاه داده، Redis و فایل‌های آپلودشده
استفاده می‌شود.

## تنظیمات production

فایل `.env.example` فقط مرجع متغیرها است و مقادیر واقعی secret نباید commit شوند. استقرار به یک
`BFF_SESSION_SECRET` تصادفی با حداقل ۳۲ نویسه و دو secret مستقل و قوی برای access و refresh توکن
بک‌اند نیاز دارد.

در محیط واقعی باید HTTPS فعال باشد و `BFF_SESSION_COOKIE_SECURE` روی `auto` یا `true` باقی بماند.
مقدار `false` فقط برای بررسی محلی روی HTTP قابل‌قبول است.

متغیرهای عمومی `NEXT_PUBLIC_*` هنگام build داخل assetهای مرورگر قرار می‌گیرند و secret نیستند. بعد
از تغییر این مقادیر باید image سرویس web دوباره ساخته شود. متغیرهای server-only هنگام شروع container
خوانده می‌شوند.

حالت برنامه به production محدود است. مقدار `NODE_ENV=production` داخل image اجرایی تنظیم شده و متغیر
`APP_ENV` یا `NEXT_PUBLIC_APP_ENV` وجود ندارد.

## ماندگاری و پشتیبان‌گیری

<ul dir="rtl" align="right">
  <li dir="rtl" align="right">volume به نام <code>postgres_data</code> شامل رکوردهای اصلی سامانه است و به backup سازگار با PostgreSQL نیاز دارد.</li>
  <li dir="rtl" align="right">volume به نام <code>redis_data</code> وضعیت AOF سرویس Redis را نگهداری می‌کند، اما جایگزین backup پایگاه داده نیست.</li>
  <li dir="rtl" align="right">volume به نام <code>uploads</code> شامل فایل‌های کاربران است و باید هماهنگ با referenceهای فایل در پایگاه داده backup گرفته شود.</li>
</ul>

## بررسی سلامت استقرار

۱. healthy بودن تمام سرویس‌های Compose را بررسی کنید.

۲. از `http://localhost/` درخواست بگیرید و پاسخ 200 همراه CSP و هدر جلوگیری از MIME sniffing را
تأیید کنید.

۳. منبع عمومی مانند `http://localhost/api/v1/majors` را فراخوانی و دریافت JSON بک‌اند را بررسی کنید.

۴. در حالت mock جریان درخواست و تأیید OTP را اجرا و HttpOnly بودن کوکی نشست و نبود توکن در JSON
مرورگر را تأیید کنید.

۵. logهای Compose را بررسی کنید تا token، cookie، request body، شماره موبایل یا ایمیل ثبت نشده باشد.

## نکات مقیاس‌پذیری

container مستقل web به‌جز secret رمزنگاری کوکی state مشترکی ندارد و پشت load balancer قابل تکثیر
است. آپلودهای بک‌اند فعلاً روی volume فایل‌سیستم قرار دارند؛ اجرای چند replica بک‌اند به object
storage یا فایل‌سیستم مشترک نیاز دارد. برای ترافیک production باید از PostgreSQL و Redis مدیریت‌شده
یا highly available استفاده شود.

---

<p dir="rtl" align="right"><strong>یادآوری:</strong> پیش از deploy، اجرای <code>npm run quality</code> و بررسی health تمام سرویس‌ها الزامی است.</p>

</div>
