import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};
export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "grid justify-items-center gap-3 rounded-lg border border-dashed border-primary/25 bg-card px-6 py-12 text-center shadow-[var(--shadow-sm)]",
        className,
      )}
    >
      {icon ?? (
        <span className="grid size-14 place-items-center rounded-full bg-secondary text-primary">
          <Inbox className="size-7" aria-hidden="true" />
        </span>
      )}
      <div className="grid gap-1">
        <h3 className="font-bold">{title}</h3>
        {description && (
          <p className="max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
