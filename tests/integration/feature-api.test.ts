import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import { examFixture, studentFixture } from "@/mocks/fixtures";
import { examsApi } from "@/services/api/exams.api";
import { adminApi } from "@/services/api/admin.api";
import { mockServer } from "@/tests/mocks/server";

describe("feature API integration", () => {
  it("maps the exam list through the same-origin gateway", async () => {
    mockServer.use(http.get("http://localhost:3000/api/v1/exams", () => HttpResponse.json([{ ...examFixture, subjects: null }])));
    await expect(examsApi.list()).resolves.toEqual([expect.objectContaining({ id: examFixture.id, subjects: [] })]);
  });
  it("sends admin pagination and approval filters", async () => {
    mockServer.use(http.get("http://localhost:3000/api/v1/admin/students/with-stats", ({ request }) => { const url = new URL(request.url); expect(url.searchParams.get("page")).toBe("2"); expect(url.searchParams.get("approved")).toBe("false"); return HttpResponse.json({ data: [{ ...studentFixture, exam_count: 1, mistake_count: 2 }], total: 21, page: 2, limit: 20 }); }));
    const result = await adminApi.students({ page: 2, limit: 20, approved: false });
    expect(result.total).toBe(21);
  });
});
