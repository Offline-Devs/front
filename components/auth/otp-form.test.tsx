/**
 * @file components/auth/otp-form.test.tsx
 * @description Unit tests for OtpForm routing logic and digit input behaviour.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { userFixture } from "@/mocks/fixtures";
import { authApi } from "@/services/api/auth.api";
import { ApiError } from "@/services/api/client";
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

  it("accepts a pasted Persian six-digit code in the first input and routes an admin", async () => {
    sessionStorage.setItem("auth.pending-phone", "+989121234567");
    vi.spyOn(authApi, "verifyOtp").mockResolvedValue({
      user: { ...userFixture, role: "admin" },
      expires_in: 3600,
    });

    renderForm();

    const inputs = await screen.findAllByRole("textbox");
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => "۱۲۳۴۵۶" },
    });

    expect(inputs.map((input) => (input as HTMLInputElement).value).join("")).toBe("123456");
    await waitFor(() =>
      expect(authApi.verifyOtp).toHaveBeenCalledWith({
        phone: "+989121234567",
        code: "123456",
      }),
    );
    expect(replace).toHaveBeenCalledWith("/admin");
  });

  it("accepts a six-digit paste from any OTP input", async () => {
    sessionStorage.setItem("auth.pending-phone", "+989121234567");
    vi.spyOn(authApi, "verifyOtp").mockResolvedValue({
      user: { ...userFixture, role: "admin" },
      expires_in: 3600,
    });

    renderForm();

    const inputs = await screen.findAllByRole("textbox");
    fireEvent.paste(inputs[3], {
      clipboardData: { getData: () => "654321" },
    });

    expect(inputs.map((input) => (input as HTMLInputElement).value).join("")).toBe("654321");
    await waitFor(() =>
      expect(authApi.verifyOtp).toHaveBeenCalledWith({
        phone: "+989121234567",
        code: "654321",
      }),
    );
  });

  it("accepts mobile one-time-code autofill on any focused input", async () => {
    sessionStorage.setItem("auth.pending-phone", "+989121234567");
    vi.spyOn(authApi, "verifyOtp").mockResolvedValue({
      user: { ...userFixture, role: "admin" },
      expires_in: 3600,
    });

    renderForm();

    const inputs = await screen.findAllByRole("textbox");
    fireEvent.change(inputs[4], { target: { value: "112233" } });

    expect(inputs.map((input) => (input as HTMLInputElement).value).join("")).toBe("112233");
    await waitFor(() =>
      expect(authApi.verifyOtp).toHaveBeenCalledWith({
        phone: "+989121234567",
        code: "112233",
      }),
    );
  });

  it("keeps automatic OTP verification errors silent until manual submit", async () => {
    sessionStorage.setItem("auth.pending-phone", "+989121234567");
    vi.spyOn(authApi, "verifyOtp").mockRejectedValue(
      new ApiError(401, { error: "invalid or expired otp" }),
    );

    renderForm();

    const inputs = await screen.findAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "123456" } });

    await waitFor(() => expect(authApi.verifyOtp).toHaveBeenCalledTimes(1));
    expect(screen.queryByRole("alert")).toBeNull();

    const submit = screen
      .getAllByRole("button")
      .find((button) => (button as HTMLButtonElement).type === "submit");
    expect(submit).toBeDefined();
    fireEvent.click(submit!);

    await waitFor(() => expect(authApi.verifyOtp).toHaveBeenCalledTimes(2));
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});
