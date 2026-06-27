/**
 * @file app/(public)/contact/page.tsx
 * @description Public contact information page.
 *
 * Static server component guarded by the enableContactPage feature flag
 * (returns notFound() when the flag is disabled). Displays four contact
 * info cards using env.supportEmail and env.supportPhone values.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { env } from "@/config/env";

export const metadata: Metadata = {
  title: "تماس با ما",
  description: `راه‌های ارتباط با پشتیبانی ${env.appName}`,
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  if (!env.enableContactPage) notFound();
  return (
    <>
      <section className="brand-grid border-b border-primary/10 bg-card">
        <div className="page-container py-14 sm:py-20">
          <SectionHeading
            eyebrow="ارتباط با ما"
            title="برای پاسخ‌گویی در کنار شما هستیم"
            description="برای پرسش درباره سامانه یا خدمات آموزشی از راه‌های زیر با پشتیبانی ارتباط بگیرید."
          />
        </div>
      </section>
      <section className="page-container py-16 sm:py-24">
        <div className="grid gap-5 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Mail className="size-7 text-primary" aria-hidden="true" />
              <CardTitle>ایمیل پشتیبانی</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={`mailto:${env.supportEmail}`}
                className="dir-ltr inline-block text-primary hover:underline"
              >
                {env.supportEmail}
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Phone className="size-7 text-primary" aria-hidden="true" />
              <CardTitle>تماس تلفنی</CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href={`tel:${env.supportPhone}`}
                className="dir-ltr inline-block text-primary hover:underline"
              >
                {env.supportPhone}
              </a>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Clock3 className="size-7 text-primary" aria-hidden="true" />
              <CardTitle>زمان پاسخ‌گویی</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">روزهای کاری، ساعت ۹ تا ۱۷</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <MapPin className="size-7 text-primary" aria-hidden="true" />
              <CardTitle>محدوده خدمت</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-7 text-muted-foreground">
                خدمات سامانه به‌صورت آنلاین ارائه می‌شود.
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 rounded-lg border border-warning/40 bg-warning/10 p-5 text-sm leading-7">
          فرم تماس در نسخه فعلی فعال نیست؛ تا زمان اضافه‌شدن endpoint امن در backend، ارتباط فقط از
          مسیرهای تاییدشده بالا انجام می‌شود.
        </div>
      </section>
    </>
  );
}
