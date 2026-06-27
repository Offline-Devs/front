/**
 * @file components/layout/public-footer.tsx
 * @description Marketing site footer with contact info and quick-access links.
 *
 * Rendered by app/(public)/layout.tsx for all public-facing pages.
 * Contact info (email, phone) uses env values from config/env.ts.
 * The copyright year is calculated dynamically via new Date().getFullYear().
 */
import { Mail, Phone } from "lucide-react";
import Link from "next/link";
import { env } from "@/config/env";
import { formatNumber } from "@/lib/formatters";
import { BrandLogo } from "@/components/ui/brand-logo";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t border-primary/10 bg-card">
      <div className="page-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.35fr_.7fr_.7fr_1fr] lg:py-16">
        <div>
          <p className="flex items-center gap-2.5 text-lg font-extrabold text-[var(--brand-strong)]">
            <BrandLogo />
            {env.appName}
          </p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted-foreground">
            {env.appDescription}
          </p>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <p className="font-bold">دسترسی سریع</p>
          <Link href="/services" className="text-muted-foreground hover:text-foreground">
            خدمات
          </Link>
          <Link href="/about" className="text-muted-foreground hover:text-foreground">
            درباره ما
          </Link>
        </div>
        <div className="grid content-start gap-2 text-sm">
          <p className="font-bold text-[var(--brand-strong)]">راهنمای کاربران</p>
          <Link href="/blog" className="text-muted-foreground hover:text-foreground">
            مقالات آموزشی
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            پشتیبانی آنلاین
          </Link>
        </div>
        <address className="grid content-start gap-2 text-sm not-italic">
          <p className="font-bold text-[var(--brand-strong)]">ارتباط با ما</p>
          <a
            className="dir-ltr flex w-fit items-center gap-2 text-muted-foreground hover:text-primary"
            href={`mailto:${env.supportEmail}`}
          >
            <Mail className="size-4" aria-hidden="true" />
            {env.supportEmail}
          </a>
          <a
            className="dir-ltr flex w-fit items-center gap-2 text-muted-foreground hover:text-primary"
            href={`tel:${env.supportPhone}`}
          >
            <Phone className="size-4" aria-hidden="true" />
            {env.supportPhone}
          </a>
        </address>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {formatNumber(new Date().getFullYear())} {env.appName}
      </div>
    </footer>
  );
}
