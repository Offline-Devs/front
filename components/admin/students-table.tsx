"use client";
import { useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ApiErrorState } from "@/components/shared/api-error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/data-table";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatNumber } from "@/lib/formatters";
import { adminApi, type StudentFilters } from "@/services/api/admin.api";
import { queryKeys } from "@/services/api/query-keys";

const PAGE_SIZE = 20;
export function StudentsTable() {
  const search = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Math.max(1, Number(search.get("page")) || 1);
  const approved = (
    ["true", "false", "all"].includes(search.get("approved") ?? "") ? search.get("approved") : "all"
  ) as "true" | "false" | "all";
  const filters: StudentFilters = {
    page,
    limit: PAGE_SIZE,
    approved: approved === "all" ? "all" : approved === "true",
  };
  const students = useQuery({
    queryKey: queryKeys.adminStudents(filters),
    queryFn: () => adminApi.students(filters),
    placeholderData: (previous) => previous,
  });
  function navigate(next: { page?: number; approved?: string }) {
    const params = new URLSearchParams(search);
    if (next.page) params.set("page", String(next.page));
    if (next.approved) {
      params.set("approved", next.approved);
      params.set("page", "1");
    }
    router.push(`${pathname}?${params}`);
  }
  if (students.isLoading) return <div className="h-96 animate-pulse rounded-lg bg-muted" />;
  if (students.isError)
    return <ApiErrorState error={students.error} retry={() => void students.refetch()} />;
  const totalPages = Math.max(1, Math.ceil((students.data?.total ?? 0) / PAGE_SIZE));
  return (
    <div className="grid gap-5">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold">وضعیت تأیید:</span>
        <Select value={approved} onValueChange={(value) => navigate({ approved: value })}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه</SelectItem>
            <SelectItem value="true">تأییدشده</SelectItem>
            <SelectItem value="false">در انتظار تأیید</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {students.data?.data.length ? (
        <TableContainer>
          <DataTable>
            <TableHeader>
              <TableRow>
                <TableHead>دانش‌آموز</TableHead>
                <TableHead>رشته / مدرسه</TableHead>
                <TableHead>آزمون</TableHead>
                <TableHead>اشتباه</TableHead>
                <TableHead>وضعیت</TableHead>
                <TableHead>عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.data.data.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <p className="font-bold">
                      {student.first_name} {student.last_name}
                    </p>
                    <bdi dir="ltr" className="text-xs text-muted-foreground">
                      {student.user?.phone}
                    </bdi>
                  </TableCell>
                  <TableCell>
                    {student.major}
                    <span className="block text-xs text-muted-foreground">{student.school}</span>
                  </TableCell>
                  <TableCell>{formatNumber(student.exam_count)}</TableCell>
                  <TableCell>{formatNumber(student.mistake_count)}</TableCell>
                  <TableCell>
                    <Badge variant={student.is_approved ? "success" : "warning"}>
                      {student.is_approved ? "تأییدشده" : "در انتظار"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/students/${student.id}`}>
                        <Eye className="size-4" />
                        پرونده
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
        </TableContainer>
      ) : (
        <EmptyState title="دانش‌آموزی با این وضعیت پیدا نشد" />
      )}
      <Pagination
        page={page}
        totalPages={totalPages}
        disabled={students.isFetching}
        onPageChange={(nextPage) => navigate({ page: nextPage })}
      />
      <p className="text-center text-xs text-muted-foreground">
        مجموع {formatNumber(students.data?.total ?? 0)} دانش‌آموز
      </p>
    </div>
  );
}
