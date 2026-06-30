/**
 * @file app/(public)/layout.tsx
 * @description Shared layout for all public (unauthenticated) pages.
 *
 * Wraps content with PublicHeader (sticky nav + mobile drawer) and
 * PublicFooter. A PageBreadcrumbs strip sits between header and main
 * content. No authentication check is performed in this layout — all
 * routes inside (public) are freely accessible.
 */
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { PageBreadcrumbs } from "@/components/layout/page-breadcrumbs";
import { getBrandConfig } from "@/config/branding";

export const dynamic = "force-dynamic";

// Public pages share this shell so their header and footer remain independent from authenticated dashboard navigation and authorization guards.
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const brand = getBrandConfig();
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader brand={brand} />
      <main className="flex-1">
        <div className="border-b border-primary/10 bg-card">
          <PageBreadcrumbs contained />
        </div>
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
