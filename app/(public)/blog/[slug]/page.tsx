import { PagePlaceholder } from "@/components/shared/page-placeholder";

// جزئیات مقاله از GET /blog/:slug؛ params در Next 16 یک Promise است.
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PagePlaceholder title="جزئیات مقاله" description={`محتوای مقاله با شناسه مسیر ${slug} در این بخش نمایش داده می‌شود.`} />;
}
