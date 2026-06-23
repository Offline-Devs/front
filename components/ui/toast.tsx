"use client";

import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { Toaster as SonnerToaster, toast } from "sonner";

export { toast };
export function Toaster() {
  return (
    <SonnerToaster
      dir="rtl"
      position="top-center"
      offset={20}
      gap={10}
      visibleToasts={4}
      duration={4000}
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
