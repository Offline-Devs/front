"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { adminApi } from "@/services/api/admin.api";
import { invalidateDependencies, invalidation } from "@/services/api/invalidation";
import { queryKeys } from "@/services/api/query-keys";

export function ApprovalActions({ studentId, approved }: { studentId: string; approved: boolean }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  async function refresh() {
    await invalidateDependencies(queryClient, invalidation.adminStudent(studentId));
    await queryClient.invalidateQueries({ queryKey: queryKeys.adminStudents() });
    router.refresh();
  }
  const approve = useMutation({
    mutationFn: () => adminApi.approve(studentId),
    onSuccess: async () => {
      toast.success("دانش‌آموز تأیید شد.");
      await refresh();
    },
  });
  const revoke = useMutation({
    mutationFn: () => adminApi.updateStudent(studentId, { is_approved: false }),
    onSuccess: async () => {
      toast.success("تأیید دانش‌آموز لغو شد.");
      await refresh();
    },
  });
  const remove = useMutation({
    mutationFn: () => adminApi.removeStudent(studentId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: queryKeys.adminStudent(studentId) });
      await queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      router.replace("/admin/students");
      router.refresh();
    },
  });
  return (
    <div className="flex flex-wrap gap-2">
      {approved ? (
        <ConfirmDialog
          trigger={
            <Button variant="outline">
              <XCircle className="size-4" />
              لغو تأیید
            </Button>
          }
          title="لغو تأیید دانش‌آموز؟"
          description="پرونده به وضعیت در انتظار تأیید بازمی‌گردد."
          confirmLabel="لغو تأیید"
          loading={revoke.isPending}
          onConfirm={() => revoke.mutate()}
        />
      ) : (
        <Button loading={approve.isPending} onClick={() => approve.mutate()}>
          <CheckCircle2 className="size-4" />
          تأیید دانش‌آموز
        </Button>
      )}
      <ConfirmDialog
        trigger={
          <Button variant="destructive">
            <Trash2 className="size-4" />
            حذف پرونده
          </Button>
        }
        title="حذف کامل پرونده؟"
        description="اطلاعات دانش‌آموز و داده‌های وابسته حذف می‌شوند. این عملیات قابل بازگشت نیست."
        confirmLabel="حذف پرونده"
        loading={remove.isPending}
        onConfirm={() => remove.mutate()}
      />
    </div>
  );
}
