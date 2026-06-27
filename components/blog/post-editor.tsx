/**
 * @file components/blog/post-editor.tsx
 * @description Admin blog post create and edit form.
 *
 * Supports HTML content authoring with a tabbed write/preview interface.
 * The preview renders sanitised HTML via sanitizeArticleHtml so the admin
 * sees an accurate representation of what the student-facing blog will display.
 *
 * A "build slug from title" helper normalises the title to a URL-safe slug
 * (Persian and Latin characters allowed; spaces → hyphens).
 *
 * On save, invalidates the admin and public blog cache keys and triggers the
 * BFF ISR cache revalidation endpoint so changes appear immediately in the
 * public blog without waiting for the revalidate timer.
 */
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Save, WandSparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { notifyFormErrors } from "@/lib/form-notifications";
import { sanitizeArticleHtml } from "@/lib/content/sanitize";
import {
  blogSchema,
  normalizeBlogSlug,
  type BlogFormOutput,
  type BlogFormValues,
} from "@/schemas/blog.schema";
import { blogApi } from "@/services/api/blog.api";
import { invalidation, invalidateDependencies } from "@/services/api/invalidation";
import type { BlogPost } from "@/types/blog";

export function PostEditor({ authorId, post }: { authorId: string; post?: BlogPost }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const form = useForm<BlogFormValues, unknown, BlogFormOutput>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      content: post?.content ?? "",
      author_id: authorId,
      published: post?.published ?? false,
    },
  });
  const content = useWatch({ control: form.control, name: "content" });
  const published = useWatch({ control: form.control, name: "published" });
  const save = useMutation<unknown, Error, BlogFormOutput>({
    meta: { successMessage: post ? "مقاله ویرایش شد." : "مقاله ایجاد شد." },
    mutationFn: (values) => (post ? blogApi.update(post.id, values) : blogApi.create(values)),
    onSuccess: async () => {
      await Promise.all([
        invalidateDependencies(queryClient, invalidation.blog),
        blogApi.revalidatePublicCache(),
      ]);
      router.replace("/admin/blog");
      router.refresh();
    },
  });
  return (
    <form
      className="grid gap-6"
      noValidate
      onSubmit={form.handleSubmit((values) => save.mutate(values), notifyFormErrors)}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="عنوان مقاله" error={form.formState.errors.title?.message} required>
          <Input {...form.register("title")} autoFocus />
        </FormField>
        <div className="grid gap-2">
          <FormField
            label="نشانی مقاله"
            hint="فارسی و لاتین مجاز است؛ فاصله به خط تیره تبدیل می‌شود."
            error={form.formState.errors.slug?.message}
            required
          >
            <Input {...form.register("slug")} dir="ltr" className="text-left" />
          </FormField>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() =>
              form.setValue("slug", normalizeBlogSlug(form.getValues("title")), {
                shouldValidate: true,
              })
            }
          >
            <WandSparkles className="size-4" />
            ساخت نشانی از عنوان
          </Button>
        </div>
      </div>
      <Tabs defaultValue="write">
        <TabsList>
          <TabsTrigger value="write">ویرایش HTML</TabsTrigger>
          <TabsTrigger value="preview">
            <Eye className="me-2 size-4" />
            پیش‌نمایش امن
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write">
          <FormField
            label="محتوای مقاله"
            hint="تگ‌های امن مانند p، h2، ul، strong و a پشتیبانی می‌شوند."
            error={form.formState.errors.content?.message}
            required
          >
            <Textarea
              {...form.register("content")}
              dir="rtl"
              rows={20}
              className="font-mono leading-7"
            />
          </FormField>
        </TabsContent>
        <TabsContent value="preview">
          <article
            className="article-content min-h-72 rounded-lg border bg-card p-5"
            dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(content) }}
          />
        </TabsContent>
      </Tabs>
      <Checkbox
        checked={published}
        onCheckedChange={(checked) => form.setValue("published", checked === true)}
        label="مقاله منتشر باشد"
        description="مقاله منتشرشده بلافاصله در بخش عمومی قابل مشاهده است."
      />
      {save.isError && (
        <Alert variant="destructive">
          <AlertDescription>{save.error.message}</AlertDescription>
        </Alert>
      )}
      <div className="flex justify-end">
        <Button type="submit" size="lg" loading={save.isPending}>
          <Save className="size-4" />
          ذخیره مقاله
        </Button>
      </div>
    </form>
  );
}
