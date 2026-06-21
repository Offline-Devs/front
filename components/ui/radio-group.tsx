"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function RadioGroup({ className, ...props }: ComponentProps<typeof RadioGroupPrimitive.Root>) { return <RadioGroupPrimitive.Root className={cn("grid gap-3", className)} {...props} />; }

type RadioItemProps = ComponentProps<typeof RadioGroupPrimitive.Item> & { label: string; description?: string };
export function RadioItem({ className, label, description, id, ...props }: RadioItemProps) {
  const generatedId = useId(); const resolvedId = id ?? generatedId;
  return <div className="flex items-start gap-3"><RadioGroupPrimitive.Item id={resolvedId} className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-input bg-card text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=checked]:border-primary disabled:opacity-50", className)} {...props}><RadioGroupPrimitive.Indicator><Circle className="size-2.5 fill-current" /></RadioGroupPrimitive.Indicator></RadioGroupPrimitive.Item><label htmlFor={resolvedId} className="grid cursor-pointer gap-0.5 text-sm"><span className="font-medium">{label}</span>{description && <span className="text-xs text-muted-foreground">{description}</span>}</label></div>;
}
