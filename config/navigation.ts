/**
 * @file config/navigation.ts
 * @description Central navigation item definitions for student and admin dashboard roles.
 *
 * DashboardNavigation and DashboardSidebar both import from this file so that
 * desktop and mobile navigation are always in sync. Adding or reordering a nav
 * item here propagates automatically to both surfaces.
 *
 * The href values are also used as keys by DashboardNavigation to resolve icons
 * from the local icon map, so they must exactly match the route paths defined in
 * the Next.js app directory.
 */
// Central navigation definitions keep desktop sidebars and mobile navigation synchronized for each authorized role.
export const navigation = {
  student: [
    { label: "داشبورد", href: "/dashboard" },
    { label: "آزمون‌ها", href: "/exams" },
    { label: "اشتباهات", href: "/mistakes" },
    { label: "عملکرد", href: "/performance" },
    { label: "آمار", href: "/statistics" },
    { label: "پروفایل", href: "/profile" },
  ],
  admin: [
    { label: "داشبورد", href: "/admin" },
    { label: "دانش‌آموزان", href: "/admin/students" },
    { label: "مقالات", href: "/admin/blog" },
    { label: "فیلدهای سفارشی", href: "/admin/dynamic-fields" },
  ],
} as const;
