import Link from "next/link";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { Button } from "@/components/ui/button";
// Shared 404 boundary handles both unknown routes and feature resources that no longer exist.
export default function NotFound() {
  return (
    <main className="page-container py-6">
      <PageBreadcrumbs currentLabel="صفحه پیدا نشد" className="mb-12 border-b pb-4" />
      <div className="grid min-h-[50vh] place-items-center text-center">
        <div className="grid justify-items-center gap-4">
          <p className="text-7xl font-black text-primary/20">۴۰۴</p>
          <h1 className="text-2xl font-black">صفحه پیدا نشد</h1>
          <Button asChild>
            <Link href="/">بازگشت به خانه</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
