/**
 * @file components/admin/dynamic-field-form.test.tsx
 * @description Integration test for DynamicFieldForm validation behaviour.
 *
 * Verifies that submitting the form with an invalid "نام فنی" (technical name)
 * value keeps the error in the DOM as a focusable alert and marks the input
 * as aria-invalid="true", ensuring keyboard and screen-reader users receive
 * actionable validation feedback.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { DynamicFieldForm } from "./dynamic-field-form";

describe("dynamic field form", () => {
  it("keeps focusable validation errors in the form", async () => {
    const user = userEvent.setup();
    const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    render(
      <QueryClientProvider client={client}>
        <DynamicFieldForm />
      </QueryClientProvider>,
    );
    await user.type(screen.getByRole("textbox", { name: /نام فنی/ }), "Invalid Name");
    await user.type(screen.getByRole("textbox", { name: /عنوان نمایشی/ }), "پایه");
    await user.click(screen.getByRole("button", { name: "ایجاد فیلد" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("نام فنی");
    expect(screen.getByRole("textbox", { name: /نام فنی/ })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
