import Link from "next/link";
// صفحه 404 برای resource یا route ناموجود.
export default function NotFound() { return <main className="p-8 text-center"><h1>صفحه پیدا نشد</h1><Link href="/">بازگشت به خانه</Link></main>; }
