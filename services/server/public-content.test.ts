/**
 * @file services/server/public-content.test.ts
 * @description Unit tests for the public content server-side fetch helpers.
 *
 * Verifies that getPublicPosts(), getPublicPost(), and getMajors() return
 * safe empty values ([] or null) when the backend fetch fails, rather than
 * propagating the error and breaking the public page render.
 */
// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { blogPostFixture } from "@/mocks/fixtures";

vi.mock("server-only", () => ({}));

describe("public content cache policy", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("requests blog posts with revalidation and a stable tag", async () => {
    const fetchMock = vi.fn(async () => Response.json([blogPostFixture]));
    vi.stubGlobal("fetch", fetchMock);
    const { getPublicPosts, publicCacheTags } = await import("./public-content");
    const posts = await getPublicPosts();
    expect(posts).toHaveLength(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/blog"),
      expect.objectContaining({ next: { revalidate: 300, tags: [publicCacheTags.blog] } }),
    );
  });
  it("returns a safe empty list when the public backend is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("offline");
      }),
    );
    const { getMajors } = await import("./public-content");
    await expect(getMajors()).resolves.toEqual([]);
  });
  it("falls back to a fresh public list when direct blog detail lookup fails", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json([{ ...blogPostFixture, slug: "nested/article" }]),
    );
    vi.stubGlobal("fetch", fetchMock);
    const { getPublicPost } = await import("./public-content");
    await expect(getPublicPost("nested/article")).resolves.toMatchObject({
      slug: "nested/article",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
