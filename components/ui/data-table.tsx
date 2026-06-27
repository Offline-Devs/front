/**
 * @file components/ui/data-table.tsx
 * @description Styled HTML table primitives for tabular data display.
 *
 * Sub-components: TableContainer (scrollable wrapper with border/shadow),
 * DataTable (min-width table), TableHeader, TableBody, TableRow, TableHead,
 * TableCell. All are server-renderable divs/elements with design-system
 * token classes. Used by StudentsTable, SubjectChart, TrendChart, and
 * MistakeReasonsChart accessible data-table alternatives.
 */
import type {
  HTMLAttributes,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

export function TableContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-lg border border-primary/10 bg-card shadow-[var(--shadow-sm)]",
        className,
      )}
      {...props}
    />
  );
}
export function DataTable({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn("w-full min-w-[36rem] caption-bottom text-sm", className)} {...props} />
  );
}
export function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("bg-secondary/80 [&_tr]:border-b", className)} {...props} />;
}
export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}
export function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("border-b transition-colors hover:bg-muted/50", className)} {...props} />
  );
}
export function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-12 px-4 text-start align-middle font-bold text-[var(--brand-strong)]",
        className,
      )}
      {...props}
    />
  );
}
export function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("p-4 align-middle", className)} {...props} />;
}
