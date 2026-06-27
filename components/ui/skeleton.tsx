/**
 * @file components/ui/skeleton.tsx
 * @description Animated loading skeleton placeholder.
 *
 * A simple aria-hidden div with animate-pulse and muted background. Used as
 * a size-matched placeholder while asynchronous content is loading. Callers
 * apply width and height via className.
 */
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
