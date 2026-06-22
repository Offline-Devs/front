import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="page-container py-12 sm:py-16">
      <div className="grid gap-6 overflow-hidden rounded-lg bg-primary px-6 py-10 text-primary-foreground shadow-[var(--shadow-md)] sm:px-10 md:grid-cols-[1fr_auto] md:items-center">
        <div className="grid gap-2">
          <h2 className="text-2xl font-black">برای یک مسیر مطالعاتی دقیق آماده‌اید؟</h2>
          <p className="max-w-2xl leading-7 text-primary-foreground">
            با ثبت آزمون‌ها و تحلیل اشتباهات، تصویر روشن‌تری از پیشرفت خود بسازید.
          </p>
        </div>
        <Button asChild variant="secondary" size="lg">
          <Link href="/login">
            ورود به سامانه
            <ArrowLeft className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
