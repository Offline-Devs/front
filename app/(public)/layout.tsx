import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";

// Public pages share this shell so their header and footer remain independent from authenticated dashboard navigation and authorization guards.
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <div className="border-b border-primary/10 bg-white">
          <PageBreadcrumbs contained />
        </div>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
