"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/formatters";
import { invalidateDependencies, invalidation } from "@/services/api/invalidation";
import { mistakesApi } from "@/services/api/mistakes.api";
import { queryKeys } from "@/services/api/query-keys";
import type { Mistake } from "@/types/mistake";
import { MistakeForm } from "./mistake-form";

export function MistakeList() { const queryClient = useQueryClient(); const [search, setSearch] = useState(""); const [editing, setEditing] = useState<Mistake | null>(null); const mistakes = useQuery({ queryKey: queryKeys.mistakes, queryFn: mistakesApi.list }); const remove = useMutation({ mutationFn: mistakesApi.remove, onSuccess: async () => invalidateDependencies(queryClient, invalidation.mistake) }); const filtered = useMemo(() => mistakes.data?.filter((item) => `${item.category} ${item.notes} ${item.question_number}`.toLowerCase().includes(search.trim().toLowerCase())) ?? [], [mistakes.data, search]); if (mistakes.isLoading) return <div className="h-64 animate-pulse rounded-lg bg-muted" />; if (mistakes.isError) return <ApiErrorState error={mistakes.error} retry={() => void mistakes.refetch()} />; if (!mistakes.data?.length) return <EmptyState title="دفترچه اشتباهات خالی است" description="اشتباهات مهم را ثبت کنید تا مرور هدفمندتری داشته باشید." action={<Button asChild><Link href="/mistakes/new"><Plus className="size-4" />ثبت اولین اشتباه</Link></Button>} />; return <div className="grid gap-5"><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجو در دسته‌بندی و یادداشت…" aria-label="جست‌وجوی اشتباهات" />{editing && <Card><CardHeader><CardTitle>ویرایش اشتباه سؤال {formatNumber(editing.question_number)}</CardTitle></CardHeader><CardContent><MistakeForm mistake={editing} onCancel={() => setEditing(null)} onSaved={() => setEditing(null)} /></CardContent></Card>}<div className="grid gap-4 md:grid-cols-2">{filtered.map((mistake) => <Card key={mistake.id}><CardHeader><div className="flex items-center justify-between"><CardTitle>{mistake.category}</CardTitle><span className="rounded-full bg-muted px-3 py-1 text-xs">سؤال {formatNumber(mistake.question_number)}</span></div></CardHeader><CardContent><p className="line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{mistake.notes || "بدون یادداشت"}</p></CardContent><CardFooter><Button size="sm" variant="outline" onClick={() => setEditing(mistake)}><Pencil className="size-4" />ویرایش</Button><ConfirmDialog trigger={<Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="size-4" />حذف</Button>} title="حذف این اشتباه؟" description="این مورد از دفترچه اشتباهات حذف می‌شود." confirmLabel="حذف" loading={remove.isPending && remove.variables === mistake.id} onConfirm={() => remove.mutate(mistake.id)} /></CardFooter></Card>)}</div>{!filtered.length && <EmptyState title="نتیجه‌ای پیدا نشد" description="عبارت جست‌وجو را تغییر دهید." />}</div>; }
