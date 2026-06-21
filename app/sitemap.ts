import type { MetadataRoute } from "next";
import { env } from "@/config/env";
import { getPublicPosts } from "@/services/server/public-content";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const paths = ["", "/services", "/about", ...(env.enableContactPage ? ["/contact"] : []), ...(env.enableBlog ? ["/blog"] : [])]; const posts = env.enableBlog ? await getPublicPosts() : []; return [...paths.map((path) => ({ url: `${env.siteUrl}${path}`, lastModified: new Date(), changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : 0.7 })), ...posts.map((post) => ({ url: `${env.siteUrl}/blog/${encodeURIComponent(post.slug)}`, lastModified: new Date(post.updated_at), changeFrequency: "monthly" as const, priority: 0.6 }))]; }
