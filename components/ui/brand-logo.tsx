import Image from "next/image";
import { env } from "@/config/env";
import { cn } from "@/lib/cn";

export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/logo.svg"
      width={39}
      height={43}
      alt={`لوگوی ${env.appName}`}
      className={cn("h-11 w-auto shrink-0 object-contain", className)}
      priority={priority}
    />
  );
}
