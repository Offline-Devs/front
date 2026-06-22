import Link from "next/link";
import { env } from "@/config/env";
import { formatNumber } from "@/lib/formatters";

export function PublicFooter() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="page-container grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold text-primary">{env.appName}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
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
        <address className="grid content-start gap-2 text-sm not-italic">
          <p className="font-bold">پشتیبانی</p>
          <a
            className="dir-ltr w-fit text-muted-foreground hover:text-foreground"
            href={`mailto:${env.supportEmail}`}
          >
            {env.supportEmail}
          </a>
          <a
            className="dir-ltr w-fit text-muted-foreground hover:text-foreground"
            href={`tel:${env.supportPhone}`}
          >
            {env.supportPhone}
          </a>
        </address>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {formatNumber(new Date().getFullYear())} {env.appName}
      </div>
    </footer>
  );
}
