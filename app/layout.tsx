import type { Metadata, Viewport } from "next";
import { AppProviders } from "@/components/providers/app-providers";
import { getBrandConfig } from "@/config/branding";
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

export const dynamic = "force-dynamic";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export function generateMetadata(): Metadata {
  const brand = getBrandConfig();
  return {
    metadataBase: new URL(env.siteUrl),
    applicationName: brand.appName,
    title: { default: brand.appName, template: `%s | ${brand.appName}` },
    description: brand.appDescription,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/logo.svg", type: "image/svg+xml" },
        { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      ],
      shortcut: "/favicon-32.png",
      apple: [{ url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" }],
    },
    appleWebApp: {
      capable: true,
      title: brand.appShortName,
      statusBarStyle: "default",
    },
    keywords: ["تحلیل آزمون", "مشاوره تحصیلی", "برنامه مطالعاتی", "دفترچه اشتباهات"],
    creator: brand.appName,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      url: env.siteUrl,
      siteName: brand.appName,
      title: brand.appName,
      description: brand.appDescription,
    },
  };
}

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
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
