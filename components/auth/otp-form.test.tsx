import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userFixture } from "@/mocks/fixtures";
import { authApi } from "@/services/api/auth.api";
import { useAuthStore } from "@/stores/auth-store";
import { OtpForm } from "./otp-form";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh, push: vi.fn() }),
}));

function renderForm() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <OtpForm />
    </QueryClientProvider>,
  );
}

describe("OTP form", () => {
  beforeEach(() => {
    sessionStorage.clear();
    replace.mockReset();
    refresh.mockReset();
    useAuthStore.getState().setUnauthenticated();
    vi.restoreAllMocks();
  });

  it("returns to login when no pending phone exists", async () => {
    renderForm();
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/login"));
  });

  it("accepts a pasted Persian six-digit code and routes an admin", async () => {
    sessionStorage.setItem("auth.pending-phone", "+989121234567");
    vi.spyOn(authApi, "verifyOtp").mockResolvedValue({
      user: { ...userFixture, role: "admin" },
      expires_in: 3600,
    });
    renderForm();
    const inputs = await screen.findAllByLabelText(/رقم .* کد تأیید/);
    fireEvent.paste(inputs[0].parentElement!, {
      clipboardData: { getData: () => "۱۲۳۴۵۶" },
    });
    expect(inputs.map((input) => (input as HTMLInputElement).value).join("")).toBe("123456");
    await userEvent.click(screen.getByRole("button", { name: "تأیید و ورود" }));
    await waitFor(() =>
      expect(authApi.verifyOtp).toHaveBeenCalledWith({
        phone: "+989121234567",
        code: "123456",
      }),
    );
    expect(replace).toHaveBeenCalledWith("/admin");
  });
});
