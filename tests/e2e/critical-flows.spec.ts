import { expect, test, type Page } from "@playwright/test";

async function login(page: Page, phone: string) {
  await page.goto("/login");
  await page.getByRole("textbox", { name: "شماره موبایل" }).fill(phone);
  await page.getByRole("button", { name: "دریافت کد تأیید" }).click();
  await expect(page).toHaveURL(/verify-otp/);
  for (const [index, digit] of [..."123456"].entries())
    await page.getByRole("textbox", { name: `رقم ${index + 1} کد تأیید` }).fill(digit);
  await page.getByRole("button", { name: "تأیید و ورود" }).click();
}

test.beforeEach(async ({ request }) => {
  await request.get("http://127.0.0.1:18080/__reset");
});

test("student onboarding, exam and mistake flow", async ({ page }) => {
  await login(page, "09121234567");
  await expect(page).toHaveURL(/complete-profile/);
  await page.getByRole("textbox", { name: "نام", exact: true }).fill("سارا");
  await page.getByRole("textbox", { name: "نام خانوادگی", exact: true }).fill("احمدی");
  await page.getByLabel("تاریخ تولد شمسی").click();
  await page.getByRole("combobox", { name: "سال تولد" }).click();
  await page.getByRole("option", { name: "۱۳۸۶" }).click();
  await page.getByRole("combobox", { name: "ماه تولد" }).click();
  await page.getByRole("option", { name: "اسفند" }).click();
  await page.getByRole("button", { name: "۲۹", exact: true }).click();
  await page.getByRole("button", { name: "تأیید تاریخ" }).click();
  await page.getByLabel("شهر").fill("بابل");
  await page.getByLabel("مدرسه").fill("نمونه");
  await page.getByRole("combobox", { name: "رشته تحصیلی" }).click();
  await page.getByRole("option", { name: "تجربی" }).click();
  await page.getByRole("button", { name: "ثبت و ورود به پنل" }).click();
  await expect(page).toHaveURL(/dashboard/);
  await page.goto("/exams/new");
  await page.getByLabel("عنوان آزمون").fill("آزمون جامع");
  await page.getByLabel("تاریخ شمسی").click();
  await page.getByRole("combobox", { name: "سال", exact: true }).click();
  await page.getByRole("option", { name: "۱۴۰۵" }).click();
  await page.getByRole("combobox", { name: "ماه", exact: true }).click();
  await page.getByRole("option", { name: "خرداد" }).click();
  await page.getByRole("button", { name: "۳۱", exact: true }).click();
  await page.getByRole("button", { name: "تأیید تاریخ" }).click();
  await page.getByRole("combobox").first().click();
  await page.getByRole("option", { name: "تجربی" }).click();
  await page.getByRole("combobox", { name: "نام درس" }).click();
  await page.getByRole("option", { name: "زیست‌شناسی" }).click();
  for (const [label, value] of [
    ["تعداد سؤال", "10"],
    ["پاسخ‌داده‌شده", "10"],
    ["صحیح", "8"],
    ["غلط", "2"],
    ["نزده", "0"],
  ])
    await page.getByLabel(label).fill(value);
  await page.getByRole("button", { name: "ثبت آزمون" }).click();
  await expect(page).toHaveURL(/exams\/4444/);
  await page.goto("/mistakes/new");
  await page.getByLabel("شماره سؤال").fill("3");
  await page.getByLabel("دسته‌بندی اشتباه").fill("بی‌دقتی");
  await page.getByLabel("یادداشت و راه‌حل صحیح").fill("صورت سؤال با دقت خوانده شود.");
  await page.getByRole("button", { name: "ثبت اشتباه" }).click();
  await expect(page).toHaveURL(/mistakes$/);
});

test("admin approval and article flow", async ({ page }) => {
  await page.request.get("http://127.0.0.1:18080/__seed-student");
  await login(page, "09000000000");
  await expect(page).toHaveURL(/admin/);
  await page.goto("/admin/students?approved=false&page=1");
  await page.getByRole("link", { name: "پرونده" }).click();
  await page.getByRole("button", { name: "تأیید دانش‌آموز" }).click();
  await expect(page.getByText("تأییدشده")).toBeVisible();
  await page.goto("/admin/blog/new");
  await page.getByLabel("عنوان مقاله").fill("تحلیل آزمون آزمایشی");
  await page.getByLabel("نشانی مقاله").fill("تحلیل آزمون");
  await page
    .getByLabel("محتوای مقاله")
    .fill("<p>این محتوای کامل برای آزمون خودکار مدیریت مقاله است.</p>");
  await page.getByRole("button", { name: "ذخیره مقاله" }).click();
  await expect(page).toHaveURL(/admin\/blog$/);
  await expect(page.getByText("تحلیل آزمون آزمایشی")).toBeVisible();
});
