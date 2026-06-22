"use client";

import { Toaster as SonnerToaster, toast } from "sonner";

export { toast };
export function Toaster() {
  return (
    <SonnerToaster
      dir="rtl"
      position="bottom-left"
      richColors
      closeButton
      toastOptions={{ classNames: { toast: "font-sans" } }}
    />
  );
}
