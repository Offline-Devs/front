"use client";
import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  DataTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-table";
import { formatNumber } from "@/lib/formatters";
import type { SubjectStatistics } from "@/types/statistics";

export function SubjectChart({ data }: { data: SubjectStatistics[] }) {
  const chartData = useMemo(() => [...data].sort((a, b) => b.percentage - a.percentage), [data]);
  return (
    <div className="grid gap-4">
      <div role="img" aria-label="نمودار مقایسه عملکرد درس‌ها" className="h-72 w-full" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="subject_name" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value) => [`${formatNumber(Number(value))}٪`, "عملکرد"]} />
            <Bar dataKey="percentage" fill="var(--primary)" radius={[5, 5, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details>
        <summary className="cursor-pointer text-sm font-bold text-primary">
          مشاهده آمار درس‌ها به‌صورت جدول
        </summary>
        <TableContainer className="mt-3">
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>درس</TableHead>
                <TableHead>صحیح</TableHead>
                <TableHead>غلط</TableHead>
                <TableHead>نزده</TableHead>
                <TableHead>درصد</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((item) => (
                <TableRow key={item.subject_name}>
                  <TableCell>{item.subject_name}</TableCell>
                  <TableCell>{formatNumber(item.correct)}</TableCell>
                  <TableCell>{formatNumber(item.wrong)}</TableCell>
                  <TableCell>{formatNumber(item.blank)}</TableCell>
                  <TableCell>{formatNumber(Math.round(item.percentage * 10) / 10)}٪</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </TableContainer>
      </details>
    </div>
  );
}
