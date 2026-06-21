import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

// پوسته مشترک صفحات عمومی؛ header و footer عمومی را از پنل‌های احراز هویت‌شده جدا می‌کند.
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <div className="flex min-h-screen flex-col"><PublicHeader /><main className="flex-1">{children}</main><PublicFooter /></div>;
}
