// پوسته مینیمال احراز هویت؛ لوگو، پس‌زمینه و card مرکزی ورود را نگه می‌دارد.
export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_top,var(--accent),transparent_45%)] p-4 sm:p-6"><div className="w-full max-w-md rounded-lg border bg-card p-5 shadow-[var(--shadow-md)] sm:p-8">{children}</div></main>;
}
