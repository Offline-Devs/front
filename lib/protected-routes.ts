const PROTECTED_ROUTE_PREFIXES = [
  "/admin",
  "/complete-profile",
  "/dashboard",
  "/exams",
  "/mistakes",
  "/performance",
  "/profile",
  "/statistics",
];

export function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function loginRedirectFor(pathname: string, search = "") {
  const next = `${pathname}${search}`;
  return `/login?next=${encodeURIComponent(next)}`;
}
