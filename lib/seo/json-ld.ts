/**
 * @file lib/seo/json-ld.ts
 * @description JSON-LD structured data factory functions for SEO.
 *
 * Exports helper functions that return typed JSON-LD objects consumed by
 * the JsonLd component (components/seo/json-ld.tsx) to emit
 * <script type="application/ld+json"> tags on public pages.
 *
 * organizationJsonLd() — generates an Organization schema using env values
 *   (name, URL, logo). Included on the landing page.
 *
 * Additional schema helpers can be added here as the public page set grows.
 */
import { env } from "@/config/env";
import type { BlogPost } from "@/types/blog";
import { articleExcerpt } from "@/lib/content/sanitize";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: env.appName,
    url: env.siteUrl,
    description: env.appDescription,
    email: env.supportEmail,
    telephone: env.supportPhone,
    sameAs: [env.instagramUrl, env.telegramUrl].filter(Boolean),
  };
}
export function articleJsonLd(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: articleExcerpt(post.content),
    datePublished: post.created_at,
    dateModified: post.updated_at,
    mainEntityOfPage: `${env.siteUrl}/blog/${encodeURIComponent(post.slug)}`,
    publisher: { "@type": "EducationalOrganization", name: env.appName, url: env.siteUrl },
  };
}
