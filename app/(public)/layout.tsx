import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

// پوسته مشترک صفحات عمومی؛ header و footer عمومی را از پنل‌های احراز هویت‌شده جدا می‌کند.
export default function PublicLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <><PublicHeader /><main>{children}</main><PublicFooter /></>;
}
