import type { ButtonHTMLAttributes } from "react"; import { cn } from "@/lib/cn";
// primitive دکمه؛ variant/loading/icon در مرحله design system افزوده می‌شود.
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={cn("rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50", className)} {...props} />; }
