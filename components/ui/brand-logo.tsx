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
    <span className={cn("block h-11 w-10 shrink-0", className)}>
      <Image
        src="/logo.svg"
        width={39}
        height={43}
        alt={`لوگوی ${env.appName}`}
        className="brand-logo-light h-full w-full object-contain"
        priority={priority}
      />
      <Image
        src="/logo-dark.png"
        width={390}
        height={430}
        alt={`لوگوی ${env.appName}`}
        className="brand-logo-dark h-full w-full object-contain"
        priority={priority}
      />
    </span>
  );
}
