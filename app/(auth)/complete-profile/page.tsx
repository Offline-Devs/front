import { PagePlaceholder } from "@/components/shared/page-placeholder";
import { requireRole } from "@/lib/server/auth-guard";
// تکمیل پروفایل اولین ورود؛ شامل آپلود عکس، رشته، تاریخ جلالی و dynamic_fields.
export default async function CompleteProfilePage() { await requireRole("student"); return <PagePlaceholder title="تکمیل پروفایل" />; }
