/**
 * @file app/robots.ts
 * @description Next.js robots.txt route handler.
 *
 * Exports a MetadataRoute.Robots object served at /robots.txt.
 * Allows all crawlers to index the site (rules: []) and includes the
 * sitemap URL derived from env.siteUrl for search engine discovery.
 */
import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  const publicRoutes = [
    "/",
    "/about",
    "/services",
    ...(env.enableContactPage ? ["/contact"] : []),
    ...(env.enableBlog ? ["/blog"] : []),
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicRoutes,
        disallow: [
          "/admin",
          "/dashboard",
          "/exams",
          "/mistakes",
          "/performance",
          "/profile",
          "/api",
          "/design-system",
        ],
      },
    ],
    sitemap: `${env.siteUrl}/sitemap.xml`,
    host: env.siteUrl,
  };
}
