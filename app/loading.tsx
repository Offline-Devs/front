import { Skeleton } from "@/components/ui/skeleton";

// Global navigation fallback; each feature can provide a more specific skeleton.
export default function Loading() { return <div className="page-container grid gap-4 py-10" aria-label="در حال بارگذاری"><Skeleton className="h-8 w-48" /><Skeleton className="h-32 w-full" /><span className="sr-only">در حال بارگذاری…</span></div>; }
