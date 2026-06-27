/**
 * @file tests/e2e/accessibility.spec.ts
 * @description Playwright E2E accessibility checks for key public and auth pages.
 *
 * Uses @axe-core/playwright to run automated WCAG 2.1 AA checks. Tests cover:
 *   - The public landing page for WCAG violations.
 *   - Keyboard navigation and reduced-motion preferences on the login page.
 *   - Toast notification ARIA position (top-center, role=region).
 *   - Dark theme persistence across page reload and its axe accessibility score.
 */
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("public and authentication pages have no critical accessibility violations", async ({
  page,
}) => {
  for (const path of ["/", "/login"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(
      results.violations,
      `${path}: ${results.violations.map((item) => item.id).join(", ")}`,
    ).toEqual([]);
  }
});

test("keyboard focus and reduced-motion preference are honored", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  const duration = await page
    .getByRole("button", { name: "دریافت کد تأیید" })
    .evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
});

test("validation notifications appear at the top center", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "دریافت کد تأیید" }).click();
  const notification = page
    .locator("[data-sonner-toast]")
    .filter({ hasText: "شماره موبایل را وارد کنید." });
  await expect(notification).toBeVisible();
  const box = await notification.boundingBox();
  expect(box).not.toBeNull();
  expect(box?.y).toBeLessThan(100);
  expect(
    Math.abs((box?.x ?? 0) + (box?.width ?? 0) / 2 - (await page.evaluate(() => innerWidth)) / 2),
  ).toBeLessThan(4);
});

test("dark theme persists and remains accessible", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.evaluate(() => localStorage.removeItem("noshirvani-theme"));
  await page.reload();
  await page.getByRole("button", { name: "فعال‌کردن تم تیره" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(
    page.locator("[data-sonner-toast]").filter({ hasText: "تم تیره فعال شد." }),
  ).toBeVisible();
  const closeButton = page.locator("[data-sonner-toast] [data-close-button]").first();
  await closeButton.hover();
  await expect(closeButton).toHaveCSS("background-color", "rgb(19, 37, 31)");
  await expect(closeButton).toHaveCSS("color", "rgb(115, 197, 167)");
  const darkResults = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(darkResults.violations).toEqual([]);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});

test("mobile navigation opens from the physical right side", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "بازکردن منوی اصلی" });
  const triggerBox = await trigger.boundingBox();
  expect(Math.abs((triggerBox?.x ?? 0) + (triggerBox?.width ?? 0) - 390)).toBeLessThanOrEqual(16);
  await trigger.click();
  const drawer = page.getByRole("dialog");
  await expect(drawer).toBeVisible();
  await drawer.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  const box = await drawer.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.abs((box?.x ?? 0) + (box?.width ?? 0) - 390)).toBeLessThanOrEqual(1);
  await drawer.getByRole("button", { name: "بستن" }).click();
  await expect(drawer).toBeHidden();
});
