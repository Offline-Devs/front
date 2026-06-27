/**
 * @file app/(public)/services/page.tsx
 * @description Public services overview page.
 *
 * Server component. Fetches the public major list from the ISR-cached
 * getMajors() helper and renders six feature cards alongside a dynamic
 * grid of supported academic majors and their subject lists.
 */
import type { Metadata } from "next";
import {
  BarChart3,
  BookOpenCheck,
  CalendarCheck2,
  FileSearch,
  NotebookPen,
  UserRoundCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CallToAction } from "@/components/marketing/call-to-action";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ServiceCard } from "@/components/marketing/service-card";
import { getMajors } from "@/services/server/public-content";

export const metadata: Metadata = {
  title: "خدمات",
  description: "خدمات مدیریت آزمون، تحلیل اشتباهات و مشاوره تحصیلی",
  alternates: { canonical: "/services" },
};
const items = [
  {
    icon: BookOpenCheck,
    title: "مدیریت آزمون",
    description: "ثبت جزئیات هر آزمون و عملکرد درس‌ها در یک فرم ساختاریافته.",
  },
  {
    icon: NotebookPen,
    title: "دفترچه اشتباهات",
    description: "ثبت علت خطا و یادداشت مرور برای جلوگیری از تکرار اشتباه.",
  },
  {
    icon: BarChart3,
    title: "تحلیل عملکرد",
    description: "بررسی روند نمره، میانگین و مقایسه عملکرد درس‌ها.",
  },
  {
    icon: CalendarCheck2,
    title: "برنامه مطالعاتی",
    description: "دریافت برنامه و یادداشت‌های مشاور در یک timeline منظم.",
  },
  {
    icon: FileSearch,
    title: "پرونده آموزشی",
    description: "دسترسی یکپارچه به آزمون‌ها، اشتباهات و گزارش‌های عملکرد.",
  },
  {
    icon: UserRoundCheck,
    title: "پیگیری مشاور",
    description: "ثبت گزارش‌های دوره‌ای برای پیگیری دقیق‌تر مسیر مطالعه.",
  },
];

export default async function ServicesPage() {
  const majors = await getMajors();
  return (
    <>
      <section className="brand-grid border-b border-primary/10 bg-card">
        <div className="page-container py-14 sm:py-20">
          <SectionHeading
            eyebrow="خدمات سامانه"
            title="از ثبت داده تا برنامه عملی"
            description="همه بخش‌ها برای ساختن یک چرخه منظم آزمون، تحلیل، مرور و برنامه‌ریزی طراحی شده‌اند."
          />
        </div>
      </section>
      <section className="page-container py-16 sm:py-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ServiceCard key={item.title} {...item} />
          ))}
        </div>
      </section>
      {majors.length > 0 && (
        <section className="border-y border-primary/10 bg-card">
          <div className="page-container py-12">
            <SectionHeading
              title="رشته‌ها و درس‌های تحت پوشش"
              description="فهرست زیر مستقیماً از تنظیمات سامانه دریافت شده است."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {majors.map((major) => (
                <div key={major.major} className="rounded-lg border p-5">
                  <h3 className="font-extrabold">{major.major}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {major.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <CallToAction />
    </>
  );
}
