import { PagePlaceholder } from "@/components/shared/page-placeholder";
// فرم ویرایش مقاله؛ چون GET by id مدیر وجود ندارد، داده از cache لیست admin تامین می‌شود.
export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <PagePlaceholder title="ویرایش مقاله" description={id} />; }
