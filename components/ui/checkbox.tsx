/**
 * @file components/ui/checkbox.tsx
 * @description Accessible checkbox with optional inline label and description.
 *
 * Built on @radix-ui/react-checkbox. Generates a stable id via useId() when
 * none is provided so the label htmlFor association always works. The label
 * and description text render alongside the checkbox for pointer-click
 * convenience. aria-invalid is forwarded for form validation states.
 */
"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

type CheckboxProps = ComponentProps<typeof CheckboxPrimitive.Root> & {
  label?: string;
  description?: string;
};

export function Checkbox({
  className,
  label,
  description,
  id: providedId,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  return (
    <div className="flex items-start gap-3">
      <CheckboxPrimitive.Root
        id={id}
        className={cn(
          "peer mt-0.5 flex size-5 shrink-0 items-center justify-center rounded border border-input bg-card text-primary-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive",
          className,
        )}
        {...props}
      >
        <CheckboxPrimitive.Indicator>
          <Check className="size-3.5" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
      {label && (
        <label
          htmlFor={id}
          className="grid cursor-pointer gap-0.5 text-sm leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-60"
        >
          <span className="font-medium">{label}</span>
          {description && <span className="text-xs text-muted-foreground">{description}</span>}
        </label>
      )}
    </div>
  );
}
