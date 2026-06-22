"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export function DrawerContent({
  className,
  children,
  side = "right",
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { side?: "right" | "left" | "bottom" }) {
  const sideClasses = {
    right: "inset-y-0 right-0 h-full w-[min(22rem,90vw)] border-l",
    left: "inset-y-0 left-0 h-full w-[min(22rem,90vw)] border-r",
    bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border-t",
  };
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-drawer-overlay
        className="fixed inset-0 z-50 bg-foreground/45 backdrop-blur-[2px]"
      />
      <DialogPrimitive.Content
        dir="rtl"
        data-drawer-content
        data-side={side}
        className={cn(
          "fixed z-50 overflow-y-auto bg-card p-5 shadow-[var(--shadow-md)] outline-none",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          className={cn(
            "absolute top-4 rounded-sm p-1 text-muted-foreground transition-transform hover:rotate-90 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
            side === "left" ? "left-4" : "right-4",
          )}
        >
          <X className="size-4" />
          <span className="sr-only">بستن</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export function DrawerHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-2 ps-8", className)} {...props} />;
}
export function DrawerTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
  return <DialogPrimitive.Title className={cn("text-lg font-bold", className)} {...props} />;
}
export function DrawerDescription({
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm leading-6 text-muted-foreground", className)}
      {...props}
    />
  );
}
