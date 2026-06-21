import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

const alertVariants = cva("relative grid gap-1 rounded-md border p-4 text-sm", { variants: { variant: { info: "bg-card", success: "border-success/30 bg-success/10", warning: "border-warning/50 bg-warning/10", destructive: "border-destructive/30 bg-destructive/5 text-destructive" } }, defaultVariants: { variant: "info" } });
type AlertProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;
export function Alert({ className, variant, ...props }: AlertProps) { return <div role={variant === "destructive" ? "alert" : "status"} className={cn(alertVariants({ variant }), className)} {...props} />; }
export function AlertTitle({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("font-semibold", className)} {...props} />; }
export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p className={cn("leading-6 opacity-90", className)} {...props} />; }
