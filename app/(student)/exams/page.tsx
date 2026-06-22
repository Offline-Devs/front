import type { Metadata } from "next";
import { Plus } from "lucide-react";
import Link from "next/link";
import { ExamList } from "@/components/exams/exam-list";
import { Button } from "@/components/ui/button";
export const metadata: Metadata = { title: "آزمون‌های من" };
export default function ExamsPage() {
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black">آزمون‌های من</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            نتایج آزمون‌ها و عملکرد هر درس را مدیریت کنید.
          </p>
        </div>
        <Button asChild>
          <Link href="/exams/new">
            <Plus className="size-4" />
            آزمون جدید
          </Link>
        </Button>
      </div>
      <ExamList />
    </div>
  );
}
