/**
 * @file services/server/public-content.ts
 * @description Server-only helpers for fetching and caching public API content.
 *
 * Uses Next.js fetch with next.revalidate and next.tags for ISR (Incremental
 * Static Regeneration). Public content (blog posts, major list) is cached at
 * the CDN / Next.js data cache layer and revalidated on a timer or on-demand.
 *
 * publicCacheTags — string constants used as revalidation tags. The admin blog
 *   save flow calls revalidatePublicCache() which triggers POST /api/cache/public-blog,
 *   and the BFF route calls revalidateTag(publicCacheTags.blog) to purge the cache.
 *
 * getPublicPosts()  — blog post list with 5-minute revalidation.
 * getPublicPost(slug) — single post with 5-minute revalidation.
 * getMajors()       — major/subject list with 24-hour revalidation.
 *
 * All functions catch errors and return safe fallbacks so public pages degrade
 * gracefully during backend outages.
 */
import "server-only";

import { serverEnv } from "@/config/server-env";
import type { BlogPost } from "@/types/blog";
import type { SubjectConfig } from "@/types/subject";

export const publicCacheTags = {
  blog: "public-blog",
  majors: "public-majors",
} as const;

async function publicFetch<T>(path: string, revalidate: number, tags: string[]): Promise<T> {
  const response = await fetch(`${serverEnv.apiBaseUrl}${path}`, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(serverEnv.apiTimeoutMs),
    next: { revalidate, tags },
  });

  if (!response.ok) {
    throw new Error(`Public API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

async function publicFetchFresh<T>(path: string): Promise<T> {
  const response = await fetch(`${serverEnv.apiBaseUrl}${path}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(serverEnv.apiTimeoutMs),
  });

  if (!response.ok) {
    throw new Error(`Public API request failed with ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getPublicPosts() {
  try {
    return await publicFetch<BlogPost[]>("/blog", 300, [publicCacheTags.blog]);
  } catch {
    return [];
  }
}

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function comparableSlugs(value: string) {
  const trimmed = value.trim().replace(/^\/+|\/+$/g, "");
  const decoded = safeDecode(trimmed);
  const encoded = encodeURIComponent(decoded);
  return new Set([
    trimmed,
    decoded,
    encoded,
    decoded.replace(/^\/+|\/+$/g, ""),
    decoded.split("/").map(encodeURIComponent).join("/"),
  ]);
}

async function findPublicPostFromFreshList(slug: string) {
  const candidates = comparableSlugs(slug);
  const posts = await publicFetchFresh<BlogPost[]>("/blog");
  return (
    posts.find((post) => {
      const postCandidates = comparableSlugs(post.slug);
      return [...candidates].some((candidate) => postCandidates.has(candidate));
    }) ?? null
  );
}

export async function getPublicPost(slug: string) {
  const cleanSlug = slug.trim().replace(/^\/+|\/+$/g, "");
  if (cleanSlug.includes("/")) {
    try {
      return await findPublicPostFromFreshList(cleanSlug);
    } catch {
      return null;
    }
  }

  try {
    return await publicFetch<BlogPost>(`/blog/${encodeURIComponent(cleanSlug)}`, 300, [
      publicCacheTags.blog,
      `public-blog:${cleanSlug}`,
    ]);
  } catch {
    try {
      return await findPublicPostFromFreshList(cleanSlug);
    } catch {
      return null;
    }
  }
}

export async function getMajors() {
  try {
    return await publicFetch<SubjectConfig[]>("/majors", 86_400, [publicCacheTags.majors]);
  } catch {
    return [];
  }
}
