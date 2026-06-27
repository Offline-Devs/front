/**
 * @file app/loading.tsx
 * @description Root-level loading skeleton shown during top-level route transitions.
 *
 * Next.js renders this automatically as the Suspense fallback for the root
 * layout while a new route's server component is streaming. Displays a simple
 * full-screen pulse animation.
 */
import { Skeleton } from "@/components/ui/skeleton";

// Global navigation fallback; each feature can provide a more specific skeleton.
export default function Loading() {
  return (
    <div className="page-container grid gap-4 py-10" aria-label="در حال بارگذاری">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-32 w-full" />
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
