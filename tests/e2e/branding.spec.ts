/**
 * @file tests/e2e/branding.spec.ts
 * @description Playwright E2E tests for brand logo presence and visual correctness.
 *
 * Tests:
 *   - The SVG logo URL is referenced in the HTML <head> and the web app manifest.
 *   - The logo is visible on the auth layout pages.
 *   - In dark mode the dark logo variant has a non-white pixel in its centre,
 *     confirming the correct image is rendered.
 */
import { expect, test } from "@playwright/test";

test("uses the provided logo for visible branding and install metadata", async ({ page }) => {
  await page.goto("/");

  const visibleLogos = page.locator('img[src*="logo.svg"]');
  await expect(visibleLogos).toHaveCount(2);
  await expect(visibleLogos.first()).toBeVisible();

  await expect(page.locator('link[rel="icon"][href*="logo.svg"]')).toHaveCount(1);
  await expect(
    page.locator('link[rel="apple-touch-icon"][href*="apple-touch-icon.png"]'),
  ).toHaveCount(1);

  const manifestResponse = await page.request.get("/manifest.webmanifest");
  expect(manifestResponse.ok()).toBe(true);
  const manifest = (await manifestResponse.json()) as {
    icons: Array<{ src: string; sizes: string; type: string }>;
  };
  expect(manifest.icons).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ src: "/logo.svg", sizes: "any", type: "image/svg+xml" }),
      expect.objectContaining({ src: "/icons/icon-192.png", sizes: "192x192" }),
      expect.objectContaining({ src: "/icons/icon-512.png", sizes: "512x512" }),
    ]),
  );

  for (const icon of manifest.icons) {
    expect((await page.request.get(icon.src)).ok(), icon.src).toBe(true);
  }
});

test("uses the provided logo on authentication pages", async ({ page }) => {
  await page.goto("/login");
  await expect(page.locator('img[src*="logo.svg"]')).toBeVisible();
});

test("uses the transparent light-green logo variant in dark theme", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "فعال‌کردن تم تیره" }).click();
  await expect(page.locator(".brand-logo-light").first()).toBeHidden();
  await expect(page.locator(".brand-logo-dark").first()).toBeVisible();

  const colors = await page.evaluate(async () => {
    const response = await fetch("/logo-dark.png");
    const image = await createImageBitmap(await response.blob());
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d")!;
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let line: number[] = [];
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] > 250) {
        line = Array.from(pixels.slice(index, index + 4));
        break;
      }
    }
    return { cornerAlpha: pixels[3], line };
  });
  expect(colors.cornerAlpha).toBe(0);
  expect(colors.line).toEqual([115, 197, 167, 255]);
});
