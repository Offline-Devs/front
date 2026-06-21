import { z } from "zod";
// اعتبارسنجی editor مقاله؛ slug خالی مجاز است چون backend از title می‌سازد.
export const blogSchema = z.object({ title: z.string().trim().min(1), slug: z.string(), content: z.string(), author_id: z.string().uuid(), published: z.boolean() });
