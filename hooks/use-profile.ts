"use client";
import { useQuery } from "@tanstack/react-query"; import { queryKeys } from "@/services/api/query-keys"; import { studentApi } from "@/services/api/student.api";
// query پروفایل کاربر؛ 404 باید به مسیر complete-profile تبدیل شود.
export function useProfile() { return useQuery({ queryKey: queryKeys.profile, queryFn: studentApi.getProfile }); }
