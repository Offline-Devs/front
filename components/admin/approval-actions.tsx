/**
 * @file components/admin/approval-actions.tsx
 * @description Approve, revoke, and delete action buttons for admin student management.
 *
 * All mutations invalidate the student detail, the student list, and the admin
 * dashboard counts on success so the UI reflects state changes reactively.
 *
 * Approve — PUT /admin/students/:id/approve
 * Revoke  — PUT /admin/students/:id with { is_approved: false }
 * Delete  — DELETE /admin/students/:id; removes from cache and navigates to list.
 *
 * After deletion the student's active session will be redirected to /forbidden
 * by the requireStudentProfile() server guard on their next navigation, because
 * their profile no longer exists in the backend.
 */
"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
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
    meta: { successMessage: "دانش‌آموز تأیید شد." },
    mutationFn: () => adminApi.approve(studentId),
    onSuccess: async () => {
      await refresh();
    },
  });
  const revoke = useMutation({
    meta: { successMessage: "تأیید دانش‌آموز لغو شد." },
    mutationFn: () => adminApi.updateStudent(studentId, { is_approved: false }),
    onSuccess: async () => {
      await refresh();
    },
  });
  const remove = useMutation({
    meta: { successMessage: "دانش‌آموز حذف شد." },
    mutationFn: () => adminApi.removeStudent(studentId),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: queryKeys.adminStudent(studentId) });
      await queryClient.invalidateQueries({ queryKey: ["admin", "students"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      router.replace("/admin/students");
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
