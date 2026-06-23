import { beforeEach, describe, expect, it, vi } from "vitest";
import { toast } from "sonner";
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
});
