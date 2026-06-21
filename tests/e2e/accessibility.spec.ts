import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("public and authentication pages have no critical accessibility violations", async ({ page }) => {
  for (const path of ["/", "/login"]) {
    await page.goto(path);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations, `${path}: ${results.violations.map((item) => item.id).join(", ")}`).toEqual([]);
  }
});

test("keyboard focus and reduced-motion preference are honored", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/login");
  await page.keyboard.press("Tab");
  await expect(page.locator(":focus")).toBeVisible();
  const duration = await page.getByRole("button", { name: "دریافت کد تأیید" }).evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(Number.parseFloat(duration)).toBeLessThanOrEqual(0.00001);
});
