/**
 * @file app/sitemap.ts
 * @description Next.js sitemap route handler.
 *
 * Exports an async function that returns a MetadataRoute.Sitemap array
 * served at /sitemap.xml. Includes static public pages (home, about,
 * services, contact, blog) and dynamically fetches all published blog post
 * slugs from the ISR-cached public content service to add individual post URLs.
 */
import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { getPublicPosts } from "@/services/server/public-content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [
    "",
    "/services",
    "/about",
    ...(env.enableContactPage ? ["/contact"] : []),
    ...(env.enableBlog ? ["/blog"] : []),
  ];
  const posts = env.enableBlog ? await getPublicPosts() : [];
  return [
    ...paths.map((path) => ({
      url: `${env.siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...posts.map((post) => ({
      url: `${env.siteUrl}/blog/${encodeURIComponent(post.slug)}`,
      lastModified: new Date(post.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
