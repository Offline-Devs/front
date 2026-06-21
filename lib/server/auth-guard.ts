import "server-only";
import { redirect } from "next/navigation";
import type { UserRole } from "@/types/auth";
import { backendFetch } from "./backend-client";
import { readSession } from "./session";

export async function requireRole(role: UserRole) { const session = await readSession(); if (!session) redirect(`/login?next=${role === "admin" ? "/admin" : "/dashboard"}`); if (session.user.role !== role) redirect("/forbidden"); return session; }
export async function requireStudentProfile() { const session = await requireRole("student"); let response: Response; try { response = await backendFetch("/students/profile", { headers: { Authorization: `Bearer ${session.accessToken}` } }); } catch { return session; } if (response.status === 404) redirect("/complete-profile"); if (response.status === 403) redirect("/forbidden"); return session; }
