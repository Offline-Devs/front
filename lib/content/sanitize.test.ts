/**
 * @file lib/content/sanitize.test.ts
 * @description Unit tests for the article HTML sanitiser and excerpt generator.
 *
 * Verifies:
 *   - Scripts, event handlers, images with onerror, and javascript: URLs are
 *     all stripped while safe tags like <h2> are preserved.
 *   - articleExcerpt produces plain text (no HTML tags) bounded by maxLength
 *     with a trailing ellipsis.
 */
import { describe, expect, it } from "vitest";
import { articleExcerpt, sanitizeArticleHtml } from "./sanitize";

describe("article sanitizer", () => {
  it("removes scripts, event handlers, images, and unsafe URL schemes", () => {
    const result = sanitizeArticleHtml(
      '<h2>عنوان</h2><script>alert(1)</script><img src=x onerror=alert(1)><a href="javascript:alert(1)" onclick="x()">لینک</a>',
    );
    expect(result).toContain("<h2>عنوان</h2>");
    expect(result).not.toMatch(/script|onerror|onclick|javascript|<img/i);
  });
  it("creates a plain bounded excerpt", () => {
    const result = articleExcerpt("<p>این یک متن <strong>آزمایشی</strong> برای خلاصه است.</p>", 16);
    expect(result).not.toContain("<");
    expect(result.endsWith("…")).toBe(true);
  });
});
