"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ComponentProps, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export const Drawer = DialogPrimitive.Root;
export const DrawerTrigger = DialogPrimitive.Trigger;
export const DrawerClose = DialogPrimitive.Close;

export function DrawerContent({ className, children, side = "right", ...props }: ComponentProps<typeof DialogPrimitive.Content> & { side?: "right" | "left" | "bottom" }) {
  const sideClasses = { right: "inset-y-0 end-0 h-full w-[min(22rem,90vw)] border-s", left: "inset-y-0 start-0 h-full w-[min(22rem,90vw)] border-e", bottom: "inset-x-0 bottom-0 max-h-[85vh] rounded-t-lg border-t" };
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/45 backdrop-blur-[2px]" /><DialogPrimitive.Content dir="rtl" className={cn("fixed z-50 overflow-y-auto bg-card p-5 shadow-[var(--shadow-md)] outline-none", sideClasses[side], className)} {...props}>{children}<DialogPrimitive.Close className="absolute end-4 top-4 rounded-sm p-1 text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"><X className="size-4" /><span className="sr-only">بستن</span></DialogPrimitive.Close></DialogPrimitive.Content></DialogPrimitive.Portal>;
}
export function DrawerHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("grid gap-2 pe-8", className)} {...props} />; }
export function DrawerTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) { return <DialogPrimitive.Title className={cn("text-lg font-bold", className)} {...props} />; }
export function DrawerDescription({ className, ...props }: ComponentProps<typeof DialogPrimitive.Description>) { return <DialogPrimitive.Description className={cn("text-sm leading-6 text-muted-foreground", className)} {...props} />; }
