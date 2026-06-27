/**
 * @file components/seo/json-ld.tsx
 * @description Injects a JSON-LD structured data script tag for SEO.
 *
 * Escapes the closing script tag by replacing < with \u003c to prevent
 * XSS via script injection in the JSON payload. Used on the public landing
 * page and blog post pages to emit Organization and Article schema.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
