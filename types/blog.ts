// قرارداد مقاله عمومی و CRUD مدیر.
export type BlogPost = { id: string; title: string; slug: string; content: string; author_id: string; published: boolean; created_at: string; updated_at: string };
export type BlogInput = Pick<BlogPost, "title" | "slug" | "content" | "author_id" | "published">;
