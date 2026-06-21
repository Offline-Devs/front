"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";

type PaginationProps = { page: number; totalPages: number; onPageChange: (page: number) => void; disabled?: boolean };
export function Pagination({ page, totalPages, onPageChange, disabled }: PaginationProps) {
  if (totalPages <= 1) return null;
  return <nav aria-label="صفحه‌بندی" className="flex items-center justify-center gap-3"><Button variant="outline" size="icon" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)} aria-label="صفحه قبلی"><ChevronRight className="size-4" /></Button><span className="min-w-24 text-center text-sm" aria-live="polite">صفحه {page} از {totalPages}</span><Button variant="outline" size="icon" disabled={disabled || page >= totalPages} onClick={() => onPageChange(page + 1)} aria-label="صفحه بعدی"><ChevronLeft className="size-4" /></Button></nav>;
}
