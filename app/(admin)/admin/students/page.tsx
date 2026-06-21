import type { Metadata } from "next"; import { Suspense } from "react"; import { StudentsTable } from "@/components/admin/students-table";
export const metadata: Metadata = { title: "مدیریت دانش‌آموزان" };
export default function AdminStudentsPage() { return <div className="grid gap-6"><div><h1 className="text-2xl font-black">مدیریت دانش‌آموزان</h1><p className="mt-2 text-sm text-muted-foreground">پرونده، وضعیت تأیید و آمار دانش‌آموزان را مدیریت کنید.</p></div><Suspense fallback={<div className="h-96 animate-pulse rounded-lg bg-muted" />}><StudentsTable /></Suspense></div>; }
