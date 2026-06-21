import { Badge } from "@/components/ui/badge";

export function StatusBadge({ active, activeLabel = "فعال", inactiveLabel = "غیرفعال" }: { active: boolean; activeLabel?: string; inactiveLabel?: string }) { return <Badge variant={active ? "success" : "secondary"}>{active ? activeLabel : inactiveLabel}</Badge>; }
