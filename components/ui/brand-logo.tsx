/**
 * @file components/ui/brand-logo.tsx
 * @description Responsive brand logo that switches between light and dark variants.
 *
 * Renders two Next.js Image elements: one with class "brand-logo-light"
 * (visible in light mode) and one with class "brand-logo-dark" (visible in
 * dark mode). CSS in globals.css toggles visibility based on data-theme.
 * The priority prop is forwarded to preload whichever variant is above the fold.
 */
import Image from "next/image";
import { cn } from "@/lib/cn";

export function BrandLogo({
  className,
  priority = false,
  label = "آینده سبز",
}: {
  className?: string;
  priority?: boolean;
  label?: string;
}) {
  return (
    <span className={cn("block h-11 w-10 shrink-0", className)}>
      <Image
        src="/logo.svg"
        width={192}
        height={208}
        alt={`لوگوی ${label}`}
        className="brand-logo-light h-full w-full object-contain"
        priority={priority}
      />
      <Image
        src="/logo-dark.svg"
        width={192}
        height={208}
        alt={`لوگوی ${label}`}
        className="brand-logo-dark h-full w-full object-contain"
        priority={priority}
      />
    </span>
  );
}
