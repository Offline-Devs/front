import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

// Public pages share this shell so their header and footer remain independent from authenticated dashboard navigation and authorization guards.
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex min-h-screen flex-col"><PublicHeader /><main className="flex-1">{children}</main><PublicFooter /></div>;
}
