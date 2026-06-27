/**
 * @file app/(student)/mistakes/new/page.tsx
 * @description Page for recording a new mistake entry.
 *
 * Renders MistakeForm in standalone create mode. On save the form
 * invalidates the mistakes cache and navigates to /mistakes.
 */
import type { Metadata } from "next";
import { MistakeForm } from "@/components/mistakes/mistake-form";
export const metadata: Metadata = { title: "ثبت اشتباه جدید" };
export default function NewMistakePage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black">ثبت اشتباه جدید</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          علت اشتباه و نکته صحیح را برای مرورهای بعدی ثبت کنید.
        </p>
      </div>
      <MistakeForm />
    </div>
  );
}
