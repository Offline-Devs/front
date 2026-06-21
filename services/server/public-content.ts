import "server-only";

import { serverEnv } from "@/config/server-env";
import type { BlogPost } from "@/types/blog";
import type { SubjectConfig } from "@/types/subject";

export const publicCacheTags = {
  blog: "public-blog",
  majors: "public-majors",
} as const;

async function publicFetch<T>(
  path: string,
  revalidate: number,
  tags: string[],
): Promise<T> {
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

export async function getPublicPosts() {
  try {
    return await publicFetch<BlogPost[]>("/blog", 300, [publicCacheTags.blog]);
  } catch {
    return [];
  }
}

export async function getPublicPost(slug: string) {
  try {
    return await publicFetch<BlogPost>(
      `/blog/${encodeURIComponent(slug)}`,
      300,
      [publicCacheTags.blog, `public-blog:${slug}`],
    );
  } catch {
    return null;
  }
}

export async function getMajors() {
  try {
    return await publicFetch<SubjectConfig[]>("/majors", 86_400, [
      publicCacheTags.majors,
    ]);
  } catch {
    return [];
  }
}
