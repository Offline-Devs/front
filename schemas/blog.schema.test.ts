/**
 * @file schemas/blog.schema.test.ts
 * @description Unit tests for blog schema validation and slug normalisation.
 *
 * Verifies normalizeBlogSlug handles mixed Persian/Latin input with excess
 * whitespace, and that blogSchema rejects content below the minimum length.
 */
import { describe, expect, it } from "vitest";
import { blogSchema, normalizeBlogSlug } from "./blog.schema";
describe("blog schema", () => {
  it("normalizes Persian and Latin slug spacing", () => {
    expect(normalizeBlogSlug("  تحلیل  آزمون Test  ")).toBe("تحلیل-آزمون-test");
  });
  it("normalizes separators and punctuation in slugs", () => {
    expect(normalizeBlogSlug("  Blog / New: Test؟  ")).toBe("blog-new-test");
  });
  it("rejects very short content", () => {
    expect(
      blogSchema.safeParse({
        title: "عنوان مقاله",
        slug: "article",
        content: "کوتاه",
        author_id: "11111111-1111-4111-8111-111111111111",
        published: false,
      }).success,
    ).toBe(false);
  });
});
