"use client";
// modal accessible آینده؛ focus trap، Escape و portal باید قبل از مصرف production اضافه شوند.
export function Modal({ open, children }: Readonly<{ open: boolean; children: React.ReactNode }>) { return open ? <div role="dialog" aria-modal="true" className="fixed inset-0 grid place-items-center bg-black/40"><div className="bg-white p-6">{children}</div></div> : null; }
