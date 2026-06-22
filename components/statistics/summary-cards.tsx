import { BookOpenCheck, NotebookPen, Percent } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber } from "@/lib/formatters";

export function SummaryCards({
  totalExams,
  averageScore,
  totalMistakes,
}: {
  totalExams: number;
  averageScore: number;
  totalMistakes: number;
}) {
  const items = [
    { label: "تعداد آزمون", value: formatNumber(totalExams), icon: BookOpenCheck },
    {
      label: "میانگین عملکرد",
      value: `${formatNumber(Math.round(averageScore * 10) / 10)}٪`,
      icon: Percent,
    },
    { label: "اشتباهات دسته‌بندی‌شده", value: formatNumber(totalMistakes), icon: NotebookPen },
  ];
  return (
    <section className="grid gap-4 sm:grid-cols-3" aria-label="خلاصه آمار">
      {items.map(({ label, value, icon: Icon }) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between pt-5">
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-black">{value}</p>
            </div>
            <span className="grid size-11 place-items-center rounded-full bg-accent text-primary">
              <Icon className="size-5" aria-hidden="true" />
            </span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
