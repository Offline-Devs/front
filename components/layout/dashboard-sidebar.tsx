import Link from "next/link";
import { navigation } from "@/config/navigation";
// sidebar responsive و role-aware؛ active state در نسخه client با usePathname تکمیل شود.
export function DashboardSidebar({ role }: { role: "student" | "admin" }) { return <aside className="hidden border-l bg-white p-5 lg:block"><nav className="grid gap-3">{navigation[role].map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav></aside>; }
