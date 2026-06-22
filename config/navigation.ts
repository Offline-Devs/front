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
