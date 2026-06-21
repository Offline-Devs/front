import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"], minimumCacheTTL: 86_400 },
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: process.cwd(),
  },
  async headers() {
    const isDevelopment = process.env.NODE_ENV !== "production";
    const csp = [
      "default-src 'self'",
      `script-src 'self'${isDevelopment ? " 'unsafe-eval'" : ""} 'unsafe-inline'`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");
    const securityHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ];
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] },
    ];
  },
};

export default nextConfig;
