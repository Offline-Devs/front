// badge وضعیت تایید/انتشار با رنگ و متن فارسی.
export function StatusBadge({ active }: { active: boolean }) { return <span>{active ? "فعال" : "غیرفعال"}</span>; }
