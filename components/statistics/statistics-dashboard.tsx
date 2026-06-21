"use client";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { normalizeStatisticsDate, totalCategorizedMistakes, validateStatisticsRange } from "@/lib/statistics";
import { queryKeys } from "@/services/api/query-keys";
import { statisticsApi } from "@/services/api/statistics.api";
import { SummaryCards } from "./summary-cards";

const chartLoading = () => <div className="h-72 animate-pulse rounded-md bg-muted" />;
const TrendChart = dynamic(() => import("./trend-chart").then((module) => module.TrendChart), { ssr: false, loading: chartLoading });
const SubjectChart = dynamic(() => import("./subject-chart").then((module) => module.SubjectChart), { ssr: false, loading: chartLoading });
const MistakeReasonsChart = dynamic(() => import("./mistake-reasons-chart").then((module) => module.MistakeReasonsChart), { ssr: false, loading: chartLoading });

export function StatisticsDashboard() {
  const searchParams = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const fromParam = searchParams.get("from") ?? ""; const toParam = searchParams.get("to") ?? "";
  const fromRef = useRef<HTMLInputElement>(null); const toRef = useRef<HTMLInputElement>(null); const [filterError, setFilterError] = useState("");
  const filters = { ...(fromParam ? { from: fromParam } : {}), ...(toParam ? { to: toParam } : {}) };
  const statistics = useQuery({ queryKey: queryKeys.statistics(filters), queryFn: () => statisticsApi.get(filters), staleTime: 60_000 });
  function applyFilters() { const normalizedFrom = normalizeStatisticsDate(fromRef.current?.value ?? ""); const normalizedTo = normalizeStatisticsDate(toRef.current?.value ?? ""); const error = validateStatisticsRange(normalizedFrom, normalizedTo); if (error) { setFilterError(error); return; } setFilterError(""); const params = new URLSearchParams(); if (normalizedFrom) params.set("from", normalizedFrom); if (normalizedTo) params.set("to", normalizedTo); router.push(`${pathname}${params.size ? `?${params}` : ""}`); }
  function clearFilters() { setFilterError(""); router.push(pathname); }
  return <div className="grid gap-6"><Card><CardContent className="grid gap-4 pt-5 sm:grid-cols-[1fr_1fr_auto]"><FormField label="از تاریخ" error={filterError || undefined}><Input key={fromParam} ref={fromRef} defaultValue={fromParam} dir="ltr" inputMode="numeric" placeholder="۱۴۰۵/۰۱/۰۱" className="text-left" /></FormField><FormField label="تا تاریخ"><Input key={toParam} ref={toRef} defaultValue={toParam} dir="ltr" inputMode="numeric" placeholder="۱۴۰۵/۱۲/۲۹" className="text-left" /></FormField><div className="flex items-end gap-2"><Button onClick={applyFilters}>اعمال بازه</Button>{(fromParam || toParam) && <Button variant="ghost" onClick={clearFilters}>پاک‌کردن</Button>}</div></CardContent></Card>{statistics.isLoading ? <div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-muted" />)}</div> : statistics.isError ? <ApiErrorState error={statistics.error} retry={() => void statistics.refetch()} /> : statistics.data?.total_exams === 0 ? <EmptyState title="آماری در این بازه وجود ندارد" description="بازه را تغییر دهید یا ابتدا نتیجه یک آزمون را ثبت کنید." /> : statistics.data ? <><SummaryCards totalExams={statistics.data.total_exams} averageScore={statistics.data.average_score} totalMistakes={totalCategorizedMistakes(statistics.data.mistakes_by_reason)} /><Card><CardHeader><CardTitle>روند عملکرد آزمون‌ها</CardTitle></CardHeader><CardContent><TrendChart data={statistics.data.trend_data} /></CardContent></Card><div className="grid gap-6 xl:grid-cols-2"><Card><CardHeader><CardTitle>عملکرد درس‌ها</CardTitle></CardHeader><CardContent><SubjectChart data={statistics.data.subject_stats} /></CardContent></Card><Card><CardHeader><CardTitle>دلایل اشتباه</CardTitle></CardHeader><CardContent>{Object.keys(statistics.data.mistakes_by_reason).length ? <MistakeReasonsChart data={statistics.data.mistakes_by_reason} /> : <EmptyState title="دلیل اشتباهی ثبت نشده است" />}</CardContent></Card></div></> : null}</div>;
}
