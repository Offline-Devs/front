import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { env } from "@/config/env";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,var(--accent),transparent_45%)] p-4 sm:p-6">
      <div className="w-full max-w-3xl">
        <Link href="/" className="mx-auto mb-5 flex w-fit items-center gap-2 font-black text-primary">
          <span className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="size-6" aria-hidden="true" />
          </span>
          {env.appShortName}
        </Link>
        <div className="rounded-lg border bg-card p-5 shadow-[var(--shadow-md)] sm:p-8">{children}</div>
      </div>
    </main>
  );
}
