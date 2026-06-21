// قرارداد اولیه جدول reusable؛ sorting/filter/pagination server-side در implementation feature وصل می‌شود.
export function DataTable({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="overflow-x-auto"><table className="w-full">{children}</table></div>; }
