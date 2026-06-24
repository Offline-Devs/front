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
