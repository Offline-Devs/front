import type { InputHTMLAttributes } from "react"; import { cn } from "@/lib/cn";
// input پایه accessible؛ label و error در FormField compose می‌شوند.
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn("w-full rounded-md border px-3 py-2", className)} {...props} />; }
