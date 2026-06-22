import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardPenLine,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CallToAction } from "@/components/marketing/call-to-action";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { PostCard } from "@/components/blog/post-card";
import { JsonLd } from "@/components/seo/json-ld";
import { env } from "@/config/env";
import { organizationJsonLd } from "@/lib/seo/json-ld";
import { getPublicPosts } from "@/services/server/public-content";

export const metadata: Metadata = {
  title: { absolute: env.appName },
  description: env.appDescription,
  alternates: { canonical: "/" },
};
const services = [
  {
    icon: BookOpenCheck,
    title: "ثبت و تحلیل آزمون",
    description: "نتایج هر درس را ثبت کنید و روند تغییر عملکرد خود را در طول زمان ببینید.",
  },
  {
    icon: BrainCircuit,
    title: "دفترچه اشتباهات",
    description:
      "اشتباهات پرتکرار را دسته‌بندی کنید و برای مرور هدفمند همیشه در دسترس داشته باشید.",
  },
  {
    icon: BarChart3,
    title: "آمار قابل فهم",
    description: "میانگین، روند نمره و عملکرد درس‌ها را با نمودارهای ساده و دقیق بررسی کنید.",
  },
];

export default async function HomePage() {
  const posts = env.enableBlog ? (await getPublicPosts()).slice(0, 3) : [];
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,var(--accent),transparent_35%)]" />
        <div className="page-container grid gap-10 py-16 sm:py-24 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
          <div className="grid gap-6">
            <div className="w-fit rounded-full border bg-card px-3 py-1 text-sm font-bold text-primary">
              سامانه هوشمند آزمون و مشاوره
            </div>
            <h1 className="text-balance text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              از نتیجه هر آزمون، یک قدم روشن برای پیشرفت بسازید.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              آزمون‌ها، اشتباهات و برنامه مطالعاتی خود را در یک فضای فارسی و منظم مدیریت کنید.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/login">
                  شروع کنید
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">مشاهده خدمات</Link>
              </Button>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md rounded-lg border bg-card p-5 shadow-[var(--shadow-md)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="grid size-11 place-items-center rounded-full bg-accent text-primary">
                <Route className="size-6" />
              </div>
              <div>
                <p className="font-bold">مسیر پیشرفت شما</p>
                <p className="text-sm text-muted-foreground">سه گام پیوسته و قابل اندازه‌گیری</p>
              </div>
            </div>
            <ol className="grid gap-4">
              {[
                [ClipboardPenLine, "ثبت نتیجه آزمون"],
                [CheckCircle2, "تحلیل اشتباهات"],
                [BarChart3, "مشاهده روند و برنامه"],
              ].map(([Icon, label], index) => {
                const StepIcon = Icon as typeof ClipboardPenLine;
                return (
                  <li
                    key={label as string}
                    className="flex items-center gap-3 rounded-md bg-muted p-3"
                  >
                    <span className="grid size-8 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {index + 1}
                    </span>
                    <StepIcon className="size-5 text-primary" />
                    <span className="font-medium">{label as string}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>
      <section className="page-container py-14 sm:py-20">
        <SectionHeading
          eyebrow="امکانات اصلی"
          title="ابزارهایی برای تصمیم‌های بهتر"
          description="داده‌های مطالعه شما باید به اقدام روشن تبدیل شوند، نه فقط عددهای پراکنده."
          centered
        />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>
      {posts.length > 0 && (
        <section className="border-y bg-muted/50">
          <div className="page-container py-14 sm:py-20">
            <div className="flex items-end justify-between gap-4">
              <SectionHeading eyebrow="مطالب آموزشی" title="تازه‌ترین مقالات" />
              <Button asChild variant="link">
                <Link href="/blog">
                  همه مقالات
                  <ArrowLeft className="size-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CallToAction />
    </>
  );
}
