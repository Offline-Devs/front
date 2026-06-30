/**
 * @file schemas/blog.schema.ts
 * @description Zod validation schema for blog post create/edit form inputs.
 *
 * Fields: title (min 3 chars), slug (normalised via normalizeBlogSlug which
 * lowercases and converts spaces to hyphens), content (min 20 chars),
 * author_id (UUID), published (boolean).
 *
 * normalizeBlogSlug(value) — exported utility that trims, lowercases, and
 *   replaces runs of whitespace with hyphens for use in the "auto-slug"
 *   button in PostEditor.
 */
import { z } from "zod";
export function normalizeBlogSlug(value: string) {
  return value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
export const blogSchema = z.object({
  title: z.string().trim().min(3, "عنوان باید حداقل ۳ نویسه باشد."),
  slug: z
    .string()
    .transform(normalizeBlogSlug)
    .refine((value) => value.length > 0, "نشانی مقاله را وارد کنید."),
  content: z.string().trim().min(20, "محتوای مقاله بسیار کوتاه است."),
  author_id: z.string().uuid(),
  published: z.boolean(),
});
export type BlogFormValues = z.input<typeof blogSchema>;
export type BlogFormOutput = z.output<typeof blogSchema>;
