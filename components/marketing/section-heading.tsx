import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid max-w-2xl gap-2",
        centered && "mx-auto justify-items-center text-center",
        className,
      )}
    >
      {eyebrow && <p className="text-sm font-bold text-primary">{eyebrow}</p>}
      <h2 className="text-balance text-2xl font-black leading-[1.6] tracking-tight text-[var(--brand-strong)] sm:text-3xl">
        {title}
      </h2>
      {description && <p className="leading-8 text-muted-foreground">{description}</p>}
    </div>
  );
}
