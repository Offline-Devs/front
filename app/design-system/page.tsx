import { notFound } from "next/navigation";
import { DesignSystemShowcase } from "@/components/design-system/design-system-showcase";
import { env } from "@/config/env";

export const metadata = { title: "راهنمای طراحی" };

// Internal review route; excluded from production deployments.
export default function DesignSystemPage() {
  if (env.appEnvironment === "production") notFound();
  return <main className="page-container py-8 sm:py-12"><header className="mb-10 grid gap-2"><p className="text-sm font-bold text-primary">Design System</p><h1 className="text-3xl font-black tracking-tight">راهنمای رابط کاربری فارسی</h1><p className="max-w-2xl leading-7 text-muted-foreground">مرجع داخلی رنگ‌ها، تایپوگرافی، حالت‌های تعاملی و نمایش محتوای ترکیبی در محیط راست‌چین.</p></header><DesignSystemShowcase /></main>;
}
