/**
 * @file types/blog.ts
 * @description TypeScript types for blog post entities.
 *
 * BlogPost is the canonical representation used by both the public blog
 * (read-only) and the admin blog management interface (full CRUD).
 * BlogInput is the mutation payload for create and update operations; it
 * includes the published flag so a post can be published in a single save
 * rather than requiring a separate publish action.
 */
// Defines the shared article representation used by public blog reads and the administrator create, update, publish, and delete workflows.
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  content: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};
export type BlogInput = Pick<BlogPost, "title" | "slug" | "content" | "author_id" | "published">;
