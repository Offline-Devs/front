// card پایه برای summary، فرم و content section.
export function Card({ children }: Readonly<{ children: React.ReactNode }>) { return <div className="rounded-xl border bg-white p-5 shadow-sm">{children}</div>; }
