import Link from "next/link";

// ناوبری responsive عمومی؛ وضعیت ورود می‌تواند CTA را به داشبورد تبدیل کند.
export function PublicHeader() {
  return <header className="border-b bg-white"><nav className="mx-auto flex max-w-6xl gap-5 p-4"><Link href="/">خانه</Link><Link href="/services">خدمات</Link><Link href="/blog">مقالات</Link><Link href="/about">درباره ما</Link><Link href="/contact">تماس</Link><Link className="mr-auto" href="/login">ورود</Link></nav></header>;
}
