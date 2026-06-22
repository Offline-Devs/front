import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";

export const metadata = { title: "دسترسی غیرمجاز" };
export default function ForbiddenPage() {
  return (
    <main className="page-container py-6">
      <PageBreadcrumbs currentLabel="دسترسی غیرمجاز" className="mb-12 border-b pb-4" />
      <div className="grid min-h-[70vh] place-items-center">
        <div className="grid max-w-md justify-items-center gap-4 text-center">
          <ShieldX className="size-14 text-destructive" aria-hidden="true" />
          <h1 className="text-2xl font-black">دسترسی به این بخش مجاز نیست</h1>
          <p className="leading-7 text-muted-foreground">
            حساب فعلی اجازه مشاهده این صفحه را ندارد.
          </p>
          <Button asChild className="mt-2">
            <Link href="/">بازگشت به صفحه اصلی</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
