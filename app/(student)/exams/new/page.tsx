import type { Metadata } from "next";
import { ExamForm } from "@/components/exams/exam-form";
export const metadata: Metadata = { title: "ثبت آزمون جدید" };
export default function NewExamPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black">ثبت آزمون جدید</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          نتیجه هر درس را دقیق وارد کنید تا آمار قابل اتکا باشد.
        </p>
      </div>
      <ExamForm />
    </div>
  );
}
