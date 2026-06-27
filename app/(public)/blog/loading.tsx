/**
 * @file app/(public)/blog/loading.tsx
 * @description Streaming skeleton shown while the blog list page fetches posts.
 *
 * Next.js automatically renders this as the Suspense fallback during the
 * server-side data fetch for app/(public)/blog/page.tsx.
 */
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div
      className="page-container grid gap-5 py-14 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="در حال بارگذاری مقالات"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="grid gap-3 rounded-lg border bg-card p-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-20 w-full" />
        </div>
      ))}
    </div>
  );
}
