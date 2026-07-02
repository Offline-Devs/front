/**
 * @file components/ui/toast.tsx
 * @description Global toast notification container and re-export.
 *
 * Wraps the Sonner Toaster with project-wide configuration:
 *   position: top-center, RTL direction, 4-second duration,
 *   up to 4 visible toasts, a close button on each toast.
 *   Custom icons for success, error, warning, and info types.
 *   CSS class names for design-system token styling (defined in globals.css).
 *
 * Re-exports the `toast` function from sonner so callers import from a single
 * project path (@/components/ui/toast) rather than from the library directly.
 */
"use client";

import type { CSSProperties } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { Toaster as SonnerToaster, toast } from "sonner";

const TOAST_DURATION_MS = 4_000;

export { toast };
export function Toaster() {
  return (
    <SonnerToaster
      dir="rtl"
      position="top-center"
      offset={20}
      gap={10}
      visibleToasts={4}
      duration={TOAST_DURATION_MS}
      style={{ "--app-toast-duration": `${TOAST_DURATION_MS}ms` } as CSSProperties}
      icons={{
        success: <CircleCheck className="size-5" />,
        error: <CircleAlert className="size-5" />,
        warning: <TriangleAlert className="size-5" />,
        info: <Info className="size-5" />,
        close: <X className="size-4" />,
      }}
      closeButton
      toastOptions={{
        classNames: {
          toast: "app-toast font-sans",
          title: "app-toast-title",
          description: "app-toast-description",
          success: "app-toast-success",
          error: "app-toast-error",
          warning: "app-toast-warning",
          info: "app-toast-info",
          closeButton: "app-toast-close",
        },
      }}
    />
  );
}
