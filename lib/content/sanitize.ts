/**
 * @file lib/content/sanitize.ts
 * @description HTML sanitisation utilities for blog article content.
 *
 * sanitizeArticleHtml(value) — strips all tags and attributes except a
 *   curated safe set (p, h2–h4, strong, em, ul, ol, li, blockquote, a,
 *   code, pre, hr) and forces rel="noopener noreferrer" on all anchor tags.
 *   javascript: and data: schemes are blocked. Used in the PostEditor preview
 *   tab and the public blog post page's dangerouslySetInnerHTML call.
 *
 * articleExcerpt(value, maxLength?) — strips all HTML tags, collapses
 *   whitespace, and truncates to maxLength characters (default 150) with an
 *   ellipsis. Used by PostCard and AdminPostList for content previews.
 */
import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p",
  "br",
  "h2",
  "h3",
  "h4",
  "strong",
  "b",
  "em",
  "i",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "code",
  "pre",
  "hr",
  "div",
];

export function sanitizeArticleHtml(value: string) {
  return sanitizeHtml(value, {
    allowedTags,
    allowedAttributes: { a: ["href", "title", "target", "rel"], code: ["dir"], pre: ["dir"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      b: "strong",
      i: "em",
      div: "p",
      a: (_tag, attributes) => ({
        tagName: "a",
        attribs: {
          ...attributes,
          rel: "noopener noreferrer",
          ...(attributes.target === "_blank" ? { target: "_blank" } : {}),
        },
      }),
    },
  });
}
export function articleExcerpt(value: string, maxLength = 150) {
  const text = sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
  return text.length > maxLength ? `${text.slice(0, maxLength).trim()}…` : text;
}
