"use client";
// error boundary سراسری؛ خطای واقعی در monitoring ثبت و retry محدود ارائه شود.
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="p-8 text-center"><p>خطایی رخ داد.</p><button className="mt-4" onClick={reset}>تلاش دوباره</button></main>; }
