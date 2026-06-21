import { cloneElement, isValidElement, useId, type ReactElement } from "react";
import { Label } from "./label";
import { cn } from "@/lib/cn";

type FieldControlProps = { id?: string; "aria-describedby"?: string; "aria-invalid"?: boolean };
type FormFieldProps = { label: string; htmlFor?: string; hint?: string; error?: string; required?: boolean; children: ReactElement<FieldControlProps>; className?: string };

export function FormField({ label, htmlFor, hint, error, required, children, className }: FormFieldProps) {
  const generatedId = useId(); const id = htmlFor ?? children.props.id ?? generatedId; const descriptionId = `${id}-description`;
  const control = isValidElement(children) ? cloneElement(children, { id, "aria-describedby": hint || error ? descriptionId : undefined, "aria-invalid": Boolean(error) || undefined }) : children;
  return <div className={cn("grid gap-2", className)}><Label htmlFor={id}>{label}{required && <span className="me-1 text-destructive" aria-hidden="true">*</span>}</Label>{control}{error ? <p id={descriptionId} className="text-xs text-destructive" role="alert">{error}</p> : hint ? <p id={descriptionId} className="text-xs text-muted-foreground">{hint}</p> : null}</div>;
}
