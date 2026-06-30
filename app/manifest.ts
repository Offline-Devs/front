/**
 * @file app/manifest.ts
 * @description Next.js Web App Manifest route handler.
 *
 * Exports a MetadataRoute.Manifest object that Next.js serves at
 * /manifest.webmanifest. Configures the PWA name, short name, icons,
 * theme color, background color, and display mode using env values.
 */
import type { MetadataRoute } from "next";
import { getBrandConfig } from "@/config/branding";

export const dynamic = "force-dynamic";

export default function manifest(): MetadataRoute.Manifest {
  const brand = getBrandConfig();
  return {
    name: brand.appName,
    short_name: brand.appShortName,
    description: brand.appDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#f7faf8",
    theme_color: "#1f7a61",
    lang: "fa",
    dir: "rtl",
    icons: [
      { src: "/logo.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
