"use client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, UsersRound } from "lucide-react";
import Link from "next/link";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatters";
import { adminApi } from "@/services/api/admin.api";

export function AdminDashboard() { const all = useQuery({ queryKey: ["admin", "dashboard", "all"], queryFn: () => adminApi.students({ page: 1, limit: 1, approved: "all" }), staleTime: 30_000 }); const approved = useQuery({ queryKey: ["admin", "dashboard", "approved"], queryFn: () => adminApi.students({ page: 1, limit: 1, approved: true }), staleTime: 30_000 }); const pending = useQuery({ queryKey: ["admin", "dashboard", "pending"], queryFn: () => adminApi.students({ page: 1, limit: 1, approved: false }), staleTime: 30_000 }); if (all.isLoading || approved.isLoading || pending.isLoading) return <div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-muted" />)}</div>; if (all.isError) return <ApiErrorState error={all.error} retry={() => void all.refetch()} />; const items = [{ label: "کل دانش‌آموزان", value: all.data?.total ?? 0, icon: UsersRound }, { label: "تأییدشده", value: approved.data?.total ?? 0, icon: CheckCircle2 }, { label: "در انتظار تأیید", value: pending.data?.total ?? 0, icon: Clock3 }]; return <div className="grid gap-6"><div className="grid gap-4 sm:grid-cols-3">{items.map(({ label, value, icon: Icon }) => <Card key={label}><CardContent className="flex items-center justify-between pt-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-black">{formatNumber(value)}</p></div><Icon className="size-8 text-primary" /></CardContent></Card>)}</div><Button asChild className="w-fit"><Link href="/admin/students?approved=false&page=1">بررسی پرونده‌های در انتظار</Link></Button></div>; }
