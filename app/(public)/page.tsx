/**
 * @file app/(public)/page.tsx
 * @description Public landing page (home) of the Noshirvani Academy platform.
 *
 * Statically rendered server component. Sections:
 *   - Hero with CTA button
 *   - Four service cards (exam analysis, mistake notebook, study planning, performance tracking)
 *   - Latest blog posts (fetched from the ISR-cached public content service)
 *   - CallToAction banner
 *
 * Includes JSON-LD Organization structured data for SEO.
 * OpenGraph metadata is exported via the Next.js metadata API.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BarChart3, BookOpenCheck, BrainCircuit, Route } from "lucide-react";
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
      <section className="brand-grid relative overflow-hidden border-b border-primary/10 bg-card">
        <div className="absolute -right-32 -top-40 size-96 rounded-full bg-accent/35 blur-3xl" />
        <div className="page-container relative grid min-h-[680px] gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_.95fr] lg:items-center">
          <div className="grid gap-7">
            <div className="w-fit rounded-full border border-primary/20 bg-secondary px-4 py-1.5 text-sm font-bold text-primary">
              سامانه هوشمند آزمون و مشاوره
            </div>
            <h1 className="text-balance text-4xl font-black leading-[1.45] tracking-tight text-[var(--brand-strong)] sm:text-5xl lg:text-[3.4rem]">
              مسیر موفقیت تحصیلی، از یک تحلیل دقیق شروع می‌شود.
            </h1>
            <p className="max-w-2xl text-lg leading-9 text-muted-foreground">
              آزمون‌ها، اشتباهات و برنامه مطالعاتی خود را در یک فضای فارسی و منظم مدیریت کنید و
              همراه مشاور، تصمیم‌های دقیق‌تری بگیرید.
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
          <div className="relative mx-auto w-full max-w-[32rem]">
            <div className="absolute -inset-4 rounded-[2rem] bg-primary/8" />
            <div className="relative overflow-hidden rounded-[1.75rem] border-8 border-card bg-card shadow-[var(--shadow-lg)]">
              <Image
                src="/images/design/student-study.webp"
                alt="دانش‌آموز در حال مطالعه و برنامه‌ریزی"
                width={1024}
                height={1024}
                priority
                unoptimized
                className="aspect-square w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 w-[min(19rem,80%)] rounded-lg border border-primary/15 bg-card p-4 shadow-[var(--shadow-md)]">
              <div className="flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-primary">
                  <Route className="size-6" />
                </div>
                <div>
                  <p className="font-bold text-[var(--brand-strong)]">مسیر پیشرفت شما</p>
                  <p className="text-xs text-muted-foreground">ثبت، تحلیل و برنامه‌ریزی هدفمند</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="page-container py-16 sm:py-24">
        <SectionHeading
          eyebrow="امکانات اصلی"
          title="ابزارهایی برای تصمیم‌های بهتر"
          description="داده‌های مطالعه شما باید به اقدام روشن تبدیل شوند، نه فقط عددهای پراکنده."
          centered
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </section>
      {posts.length > 0 && (
        <section className="border-y border-primary/10 bg-card">
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
