/**
 * @file lib/query-client.test.ts
 * @description Unit tests for createQueryClient() configuration.
 *
 * Verifies that the mutation cache shows a success toast when
 * mutation.meta.successMessage is set, and that the query cache suppresses
 * the error toast when query.meta.suppressErrorToast is true.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
import { ApiError } from "@/services/api/client";
import { createQueryClient } from "./query-client";

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() },
}));

describe("global query notifications", () => {
  beforeEach(() => vi.clearAllMocks());

  it("announces mutation success using operation metadata", async () => {
    const client = createQueryClient();
    const mutation = client.getMutationCache().build(client, {
      mutationFn: async () => ({ ok: true }),
      meta: { successMessage: "ذخیره شد." },
    });
    await mutation.execute(undefined);
    expect(toast.success).toHaveBeenCalledWith("ذخیره شد.");
  });

  it("announces mutation errors", async () => {
    const client = createQueryClient();
    const mutation = client.getMutationCache().build(client, {
      mutationFn: async () => {
        throw new Error("عملیات ناموفق بود.");
      },
    });
    await expect(mutation.execute(undefined)).rejects.toThrow("عملیات ناموفق بود.");
    expect(toast.error).toHaveBeenCalledWith("عملیات ناموفق بود.");
  });

  it("does not announce unauthorized mutation errors", async () => {
    const client = createQueryClient();
    const mutation = client.getMutationCache().build(client, {
      mutationFn: async () => {
        throw new ApiError(401, { error: "unauthenticated" });
      },
    });
    await expect(mutation.execute(undefined)).rejects.toBeInstanceOf(ApiError);
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("does not announce expected query errors", async () => {
    const client = createQueryClient();
    await expect(
      client.fetchQuery({
        queryKey: ["session"],
        queryFn: async () => {
          throw new Error("نشست شما منقضی شده است.");
        },
        meta: { suppressErrorToast: true },
        retry: false,
      }),
    ).rejects.toThrow("نشست شما منقضی شده است.");
    expect(toast.error).not.toHaveBeenCalled();
  });
});
