import Link from "next/link";
// Shared 404 boundary handles both unknown routes and feature resources that no longer exist.
export default function NotFound() {
  return (
    <main className="p-8 text-center">
      <h1>صفحه پیدا نشد</h1>
      <Link href="/">بازگشت به خانه</Link>
    </main>
  );
}
