/**
 * @file components/ui/form-field.tsx
 * @description Accessible form field wrapper: label, control, hint, and error.
 *
 * Clones the child control element to inject id, aria-labelledby,
 * aria-describedby, and aria-invalid attributes automatically, eliminating
 * the need to wire these by hand in every form. The generated description id
 * links either the error message (role="alert") or the hint text to the
 * control for screen readers.
 *
 * Required fields display a red asterisk before the label text (visually
 * only; the asterisk is aria-hidden).
 */
import { cloneElement, isValidElement, useId, type ReactElement } from "react";
import { Label } from "./label";
import { cn } from "@/lib/cn";

type FieldControlProps = {
  id?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-labelledby"?: string;
};
type FormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactElement<FieldControlProps>;
  className?: string;
};

export function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  const generatedId = useId();
  const id = htmlFor ?? children.props.id ?? generatedId;
  const descriptionId = `${id}-description`;
  const labelId = `${id}-label`;
  const control = isValidElement(children)
    ? cloneElement(children, {
        id,
        "aria-labelledby": labelId,
        "aria-describedby": hint || error ? descriptionId : undefined,
        "aria-invalid": Boolean(error) || undefined,
      })
    : children;
  return (
    <div className={cn("grid gap-2", className)}>
      <Label id={labelId} htmlFor={id}>
        {label}
        {required && (
          <span className="me-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {control}
      {error ? (
        <p id={descriptionId} className="text-xs text-destructive" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={descriptionId} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
