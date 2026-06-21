import { env } from "@/config/env";

// footer عمومی شامل اطلاعات تماس، لینک‌ها، شبکه‌ها و copyright خواهد بود.
export function PublicFooter() { return <footer className="mt-12 border-t p-6 text-center text-sm text-slate-500">{env.appName}</footer>; }
