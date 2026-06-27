/**
 * @file app/(admin)/admin/dynamic-fields/page.tsx
 * @description Admin dynamic field definitions management page.
 *
 * Renders DynamicFieldForm (create new field) above DynamicFieldsTable
 * (list, edit, delete existing field definitions). Field definitions
 * control which extra fields appear in student profiles, exams, and
 * mistake entries across the platform.
 */
import type { Metadata } from "next";
import { DynamicFieldForm } from "@/components/admin/dynamic-field-form";
import { DynamicFieldsTable } from "@/components/admin/dynamic-fields-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export const metadata: Metadata = { title: "فیلدهای سفارشی" };
export default function DynamicFieldsPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-black">فیلدهای سفارشی</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          تعریف‌های قابل استفاده در پروفایل، آزمون و دفترچه اشتباهات.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>فیلد جدید</CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFieldForm />
        </CardContent>
      </Card>
      <DynamicFieldsTable />
    </div>
  );
}
