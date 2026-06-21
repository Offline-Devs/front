import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "آکادمی نوشیروانی", template: "%s | آکادمی نوشیروانی" },
  description: "سامانه مدیریت آزمون و مشاوره تحصیلی آکادمی نوشیروانی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        {/* همه providerهای سراسری فقط در این مرز client قرار می‌گیرند. */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
