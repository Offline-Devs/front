"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({
  className,
  children,
  "aria-label": ariaLabel = "انتخاب گزینه",
  ...props
}: ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      aria-label={ariaLabel}
      className={cn(
        "flex h-11 w-full items-center justify-between gap-2 rounded-md border border-input bg-card px-4 text-sm shadow-sm outline-none transition-all hover:border-primary/40 focus:border-ring focus:ring-3 focus:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-60 data-[placeholder]:text-muted-foreground aria-invalid:border-destructive",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="size-4 opacity-60" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        dir="rtl"
        position={position}
        className={cn(
          "z-50 min-w-[8rem] overflow-hidden rounded-md border border-primary/10 bg-popover text-popover-foreground shadow-[var(--shadow-md)] data-[state=open]:animate-in",
          position === "popper" && "w-[var(--radix-select-trigger-width)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.Viewport className="max-h-[min(18rem,var(--radix-select-content-available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1 [scrollbar-gutter:stable] [scrollbar-width:thin]">
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({
  className,
  children,
  ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full select-none items-center rounded-sm py-2 pe-8 ps-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
    >
      <span className="absolute end-2 flex size-4 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
