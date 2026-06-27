/**
 * @file components/marketing/service-card.tsx
 * @description Icon + title + description card for the services section of the landing page.
 * The icon container transitions from secondary to primary on hover for visual feedback.
 */
import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ServiceCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="group h-full border-primary/10 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[var(--shadow-md)]">
      <CardHeader>
        <div className="mb-2 grid size-12 place-items-center rounded-md bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon className="size-6" aria-hidden="true" />
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-7 text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
