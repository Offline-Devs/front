import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { env } from "@/config/env";
import "./globals.css";

const themeScript = `(() => {
  try {
    const saved = localStorage.getItem("noshirvani-theme");
    const theme = saved === "dark" || saved === "light"
      ? saved
      : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch { document.documentElement.dataset.theme = "light"; }
})();`;

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  applicationName: env.appName,
  title: { default: env.appName, template: `%s | ${env.appName}` },
  description: env.appDescription,
  manifest: "/manifest.webmanifest",
  keywords: ["تحلیل آزمون", "مشاوره تحصیلی", "برنامه مطالعاتی", "دفترچه اشتباهات"],
  creator: env.appName,
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
    <html
      lang="fa"
      dir="rtl"
      className="h-full"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground antialiased">
        {/* Global browser providers are isolated behind this client boundary so the root layout and route tree remain server-rendered by default. */}
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
