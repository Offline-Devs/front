type PagePlaceholderProps = { title: string; description?: string };

// خروجی موقت همه routeها؛ در مراحل UI با feature component همان صفحه جایگزین می‌شود.
export function PagePlaceholder({ title, description }: PagePlaceholderProps) {
  return <section className="page-container py-8 sm:py-10"><h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>{description && <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">{description}</p>}</section>;
}
