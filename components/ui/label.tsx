/**
 * @file components/ui/label.tsx
 * @description Accessible HTML label element with consistent typography styling.
 *
 * A thin wrapper around <label> that applies the design system's form label
 * font size, weight, and disabled-state opacity. Used internally by FormField
 * and can be used standalone when FormField's automatic id wiring is not needed.
 */
import type { LabelHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}
