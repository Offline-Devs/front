import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
export const metadata: Metadata = { title: "داشبورد مدیریت" };
export default function AdminDashboardPage() { return <div className="grid gap-6"><div><h1 className="text-2xl font-black">داشبورد مدیریت</h1><p className="mt-2 text-sm text-muted-foreground">وضعیت کلی پرونده‌های دانش‌آموزان.</p></div><AdminDashboard /></div>; }
