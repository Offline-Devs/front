"use client";
import { useMemo } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { DataTable, TableBody, TableCell, TableContainer, TableHead, TableHeader, TableRow } from "@/components/ui/data-table";
import { formatNumber } from "@/lib/formatters";
import type { TrendPoint } from "@/types/statistics";

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const chartData = useMemo(() => data.map((item) => ({ ...item, score: Math.round(item.score * 10) / 10 })), [data]);
  return <div className="grid gap-4"><div role="img" aria-label="نمودار روند عملکرد آزمون‌ها" className="h-72 w-full" dir="ltr"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="jalali_date" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} /><Tooltip formatter={(value) => [`${formatNumber(Number(value))}٪`, "عملکرد"]} labelFormatter={(label) => `تاریخ ${label}`} /><Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer></div><details><summary className="cursor-pointer text-sm font-bold text-primary">مشاهده داده‌های روند به‌صورت جدول</summary><TableContainer className="mt-3"><DataTable><TableHeader><TableRow><TableHead>تاریخ</TableHead><TableHead>شماره آزمون</TableHead><TableHead>عملکرد</TableHead></TableRow></TableHeader><TableBody>{chartData.map((item) => <TableRow key={`${item.date}-${item.exam_count}`}><TableCell>{item.jalali_date}</TableCell><TableCell>{formatNumber(item.exam_count)}</TableCell><TableCell>{formatNumber(item.score)}٪</TableCell></TableRow>)}</TableBody></DataTable></TableContainer></details></div>;
}
