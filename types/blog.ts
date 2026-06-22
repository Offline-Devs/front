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
