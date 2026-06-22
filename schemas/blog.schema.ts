import { z } from "zod";
export function normalizeBlogSlug(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
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
