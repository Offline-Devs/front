import type { Metadata } from "next";
import { Eye, HeartHandshake, ShieldCheck, Target } from "lucide-react";
import { CallToAction } from "@/components/marketing/call-to-action";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { env } from "@/config/env";

export const metadata: Metadata = {
  title: "درباره ما",
  description: `درباره ${env.appName} و رویکرد آن در تحلیل آزمون و مشاوره تحصیلی`,
  alternates: { canonical: "/about" },
};
const values = [
  {
    icon: Target,
    title: "تصمیم مبتنی بر داده",
    description: "هر گزارش باید به یک اقدام مشخص و قابل پیگیری در برنامه مطالعه تبدیل شود.",
  },
  {
    icon: Eye,
    title: "شفافیت مسیر",
    description: "دانش‌آموز باید بداند در کدام درس پیشرفت کرده و گام بعدی چیست.",
  },
  {
    icon: HeartHandshake,
    title: "همراهی انسانی",
    description: "فناوری ابزار مشاور است و جای ارتباط و درک شرایط دانش‌آموز را نمی‌گیرد.",
  },
  {
    icon: ShieldCheck,
    title: "حریم خصوصی",
    description: "اطلاعات آموزشی فقط در محدوده دسترسی تعریف‌شده نگهداری و نمایش داده می‌شوند.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="brand-grid border-b border-primary/10 bg-card">
        <div className="page-container py-14 sm:py-20">
          <SectionHeading
            eyebrow="درباره ما"
            title="تحلیل دقیق برای مطالعه هدفمند"
            description={`${env.appName} برای تبدیل نتایج آزمون و تجربه‌های روزانه مطالعه به یک مسیر روشن و قابل پیگیری ساخته شده است.`}
          />
        </div>
      </section>
      <section className="page-container grid gap-10 py-14 sm:py-20 lg:grid-cols-2 lg:items-center">
        <div className="grid gap-5">
          <h2 className="text-2xl font-black sm:text-3xl">مسئله‌ای که حل می‌کنیم</h2>
          <p className="leading-8 text-muted-foreground">
            ثبت نمره به‌تنهایی باعث پیشرفت نمی‌شود. ارزش واقعی زمانی ایجاد می‌شود که اشتباهات
            دسته‌بندی شوند، روند عملکرد دیده شود و برنامه بعدی بر اساس همان اطلاعات تنظیم شود.
          </p>
          <p className="leading-8 text-muted-foreground">
            سامانه این داده‌های پراکنده را کنار هم قرار می‌دهد تا دانش‌آموز و مشاور تصویر مشترک و
            دقیق‌تری از مسیر داشته باشند.
          </p>
        </div>
        <div className="rounded-lg border border-primary/15 bg-card p-7 shadow-[var(--shadow-md)]">
          <p className="text-sm font-bold text-primary">ماموریت</p>
          <blockquote className="mt-3 text-balance text-2xl font-black leading-10">
            کمک به دانش‌آموز برای شناخت بهتر عملکرد خود و انتخاب گام بعدی با اطمینان بیشتر.
          </blockquote>
        </div>
      </section>
      <section className="border-y border-primary/10 bg-card">
        <div className="page-container py-14 sm:py-20">
          <SectionHeading title="اصول طراحی و خدمت" centered />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map(({ icon: Icon, title, description }) => (
              <Card key={title}>
                <CardHeader>
                  <Icon className="size-7 text-primary" aria-hidden="true" />
                  <CardTitle>{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-7 text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </>
  );
}
