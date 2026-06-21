type PagePlaceholderProps = { title: string; description?: string };

// خروجی موقت همه routeها؛ در مراحل UI با feature component همان صفحه جایگزین می‌شود.
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return <section className="mx-auto w-full max-w-6xl p-6"><h1 className="text-2xl font-bold">{title}</h1>{description && <p className="mt-3 text-slate-600">{description}</p>}</section>;
}
