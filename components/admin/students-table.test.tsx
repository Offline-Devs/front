import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { axe } from "vitest-axe";
import { describe, expect, it, vi } from "vitest";
import { studentFixture } from "@/mocks/fixtures";
import { mockServer } from "@/tests/mocks/server";
import { StudentsTable } from "./students-table";

vi.mock("next/navigation", () => ({ useSearchParams: () => new URLSearchParams("page=1&approved=all"), useRouter: () => ({ push: vi.fn() }), usePathname: () => "/admin/students" }));

describe("admin students table", () => {
  it("renders asynchronous rows with accessible table semantics", async () => {
    mockServer.use(http.get("http://localhost:3000/api/v1/admin/students/with-stats", () => HttpResponse.json({ data: [{ ...studentFixture, exam_count: 4, mistake_count: 7 }], total: 1, page: 1, limit: 20 })));
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { container } = render(<QueryClientProvider client={client}><StudentsTable /></QueryClientProvider>);
    expect(await screen.findByRole("cell", { name: /سارا احمدی/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "پرونده" })).toHaveAttribute("href", `/admin/students/${studentFixture.id}`);
    const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations).toEqual([]);
  });
});
