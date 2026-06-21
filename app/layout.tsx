import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { env } from "@/config/env";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  applicationName: env.appName,
  title: { default: env.appName, template: `%s | ${env.appName}` },
  description: env.appDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: env.siteUrl,
    siteName: env.appName,
    title: env.appName,
    description: env.appDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-full bg-background text-foreground antialiased">
        {/* همه providerهای سراسری فقط در این مرز client قرار می‌گیرند. */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
