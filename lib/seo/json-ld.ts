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
