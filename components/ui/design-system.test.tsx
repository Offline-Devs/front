import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { FormField } from "./form-field";
import { Input } from "./input";
import { Modal, ModalContent, ModalDescription, ModalTitle, ModalTrigger } from "./modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { TooltipProvider } from "./tooltip";
import { DesignSystemShowcase } from "@/components/design-system/design-system-showcase";

describe("design system accessibility", () => {
  it("associates labels, hints, and errors with form controls", async () => {
    const { container } = render(<FormField label="شماره موبایل" hint="شماره با کد کشور" required><Input /></FormField>);
    const input = screen.getByRole("textbox", { name: /شماره موبایل/ });
    expect(input).toHaveAccessibleDescription("شماره با کد کشور");
    const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations).toEqual([]);
  });

  it("exposes loading and disabled button states", () => {
    render(<Button loading>ذخیره</Button>);
    expect(screen.getByRole("button", { name: "ذخیره" })).toBeDisabled();
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("moves focus into a modal and closes with Escape", async () => {
    const user = userEvent.setup();
    render(<Modal><ModalTrigger asChild><Button>بازکردن</Button></ModalTrigger><ModalContent><ModalTitle>ویرایش پروفایل</ModalTitle><ModalDescription>اطلاعات را ویرایش کنید.</ModalDescription><Button>ذخیره</Button></ModalContent></Modal>);
    await user.click(screen.getByRole("button", { name: "بازکردن" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("supports keyboard navigation for tabs", async () => {
    const user = userEvent.setup();
    render(<Tabs defaultValue="one" dir="rtl"><TabsList aria-label="بخش‌ها"><TabsTrigger value="one">اول</TabsTrigger><TabsTrigger value="two">دوم</TabsTrigger></TabsList><TabsContent value="one">محتوای اول</TabsContent><TabsContent value="two">محتوای دوم</TabsContent></Tabs>);
    screen.getByRole("tab", { name: "اول" }).focus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "دوم" })).toHaveAttribute("data-state", "active");
  });

  it("has no baseline axe violations in the full showcase", async () => {
    const { container } = render(<TooltipProvider><DesignSystemShowcase /></TooltipProvider>);
    const results = await axe(container, { rules: { "color-contrast": { enabled: false } } });
    expect(results.violations).toEqual([]);
  });
});
