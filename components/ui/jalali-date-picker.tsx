/**
 * @file components/ui/jalali-date-picker.tsx
 * @description Fully self-contained Jalali (Solar Hijri) date picker modal.
 *
 * Implements the Jalali calendar algorithm for leap-year detection and
 * correct month lengths entirely in TypeScript — no external calendar library.
 *
 * Exported utilities (also used in tests):
 *   isJalaliLeapYear(year)      — true when the year is a Jalali leap year.
 *   daysInJalaliMonth(year, m)  — correct day count for any month/year pair.
 *   getCurrentJalaliYear()      — derives the current Jalali year via Intl.
 *
 * Purpose prop controls year range:
 *   "birth"   — year list ends at current year (no future birth dates).
 *   "general" — year list extends 5 years into the future.
 *
 * The selected date is managed as a YYYY/MM/DD string, consistent with the
 * zero-padded canonical format the backend stores and compares.
 */
"use client";

import { CalendarDays, Check } from "lucide-react";
import { useMemo, useState, type AriaAttributes } from "react";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/cn";

const monthNames = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

const persianDigits = new Intl.NumberFormat("fa-IR", { useGrouping: false });

function integerDivide(a: number, b: number) {
  return Math.trunc(a / b);
}

function modulo(a: number, b: number) {
  return a - Math.trunc(a / b) * b;
}

export function isJalaliLeapYear(year: number) {
  const breaks = [
    -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394,
    2456, 3178,
  ];
  let previous = breaks[0];
  let jump = 0;
  let next = 0;

  if (year < previous || year >= breaks.at(-1)!) return false;

  for (let index = 1; index < breaks.length; index += 1) {
    next = breaks[index];
    jump = next - previous;
    if (year < next) break;
    previous = next;
  }

  let yearsSinceBreak = year - previous;
  if (jump - yearsSinceBreak < 6) {
    yearsSinceBreak = yearsSinceBreak - jump + integerDivide(jump + 4, 33) * 33;
  }
  let leap = modulo(modulo(yearsSinceBreak + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return leap === 0;
}

export function daysInJalaliMonth(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeapYear(year) ? 30 : 29;
}

export function getCurrentJalaliYear() {
  const yearPart = new Intl.DateTimeFormat("en-US-u-ca-persian", { year: "numeric" })
    .formatToParts(new Date())
    .find((part) => part.type === "year")?.value;
  return Number(yearPart);
}

function parseValue(value: string) {
  const [year, month, day] = value.split("/").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
}

function buildValue(year: number, month: number, day: number) {
  return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
}

type JalaliDatePickerProps = AriaAttributes & {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  purpose?: "birth" | "general";
  title?: string;
  placeholder?: string;
};

export function JalaliDatePicker({
  id,
  value,
  onChange,
  disabled,
  className,
  purpose = "general",
  title = "انتخاب تاریخ",
  placeholder = "انتخاب تاریخ",
  ...ariaProps
}: JalaliDatePickerProps) {
  const currentYear = getCurrentJalaliYear();
  const maximumYear = purpose === "birth" ? currentYear : currentYear + 5;
  const fallbackYear = purpose === "birth" ? currentYear - 18 : currentYear;
  const selected = parseValue(value);
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(selected?.year ?? fallbackYear);
  const [month, setMonth] = useState(selected?.month ?? 1);
  const [day, setDay] = useState(selected?.day ?? 1);
  const years = useMemo(
    () => Array.from({ length: maximumYear - 1299 }, (_, index) => maximumYear - index),
    [maximumYear],
  );
  const dayCount = daysInJalaliMonth(year, month);

  function changeYear(nextYear: number) {
    setYear(nextYear);
    setDay((current) => Math.min(current, daysInJalaliMonth(nextYear, month)));
  }

  function changeMonth(nextMonth: number) {
    setMonth(nextMonth);
    setDay((current) => Math.min(current, daysInJalaliMonth(year, nextMonth)));
  }

  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      const current = parseValue(value);
      setYear(current?.year ?? fallbackYear);
      setMonth(current?.month ?? 1);
      setDay(current?.day ?? 1);
    }
    setOpen(nextOpen);
  }

  function confirmSelection() {
    onChange(buildValue(year, month, day));
    setOpen(false);
  }

  return (
    <>
      <button
        id={id}
        type="button"
        disabled={disabled}
        className={cn(
          "flex h-11 w-full items-center justify-between rounded-md border border-input bg-card px-4 text-sm shadow-sm transition-all hover:border-primary/50 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
          !selected && "text-muted-foreground",
          className,
        )}
        onClick={() => handleOpenChange(true)}
        {...ariaProps}
      >
        <span>
          {selected ? value.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]) : placeholder}
        </span>
        <CalendarDays className="size-5 text-primary" aria-hidden="true" />
      </button>

      <Modal open={open} onOpenChange={handleOpenChange}>
        <ModalContent className="max-h-[calc(100dvh-1rem)] max-w-md gap-0 overflow-y-auto p-0">
          <div className="brand-grid border-b border-primary/10 bg-secondary/70 p-5">
            <ModalHeader>
              <ModalTitle className="flex items-center gap-2 text-[var(--brand-strong)]">
                <CalendarDays className="size-5 text-primary" aria-hidden="true" />
                {title}
              </ModalTitle>
              <ModalDescription>
                ابتدا سال و ماه را انتخاب کنید، سپس روی روز بزنید.
              </ModalDescription>
            </ModalHeader>
          </div>

          <div className="grid gap-5 p-5">
            <div className="grid grid-cols-2 gap-3">
              <Select value={String(year)} onValueChange={(item) => changeYear(Number(item))}>
                <SelectTrigger aria-label={purpose === "birth" ? "سال تولد" : "سال"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((item) => (
                    <SelectItem key={item} value={String(item)}>
                      {persianDigits.format(item)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={String(month)} onValueChange={(item) => changeMonth(Number(item))}>
                <SelectTrigger aria-label={purpose === "birth" ? "ماه تولد" : "ماه"}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {monthNames.map((name, index) => (
                    <SelectItem key={name} value={String(index + 1)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              {purpose === "birth" && (
                <p className="mb-3 text-sm font-bold text-[var(--brand-strong)]">روز تولد</p>
              )}
              <div className="grid grid-cols-7 gap-1.5" role="group" aria-label="روز ماه">
                {Array.from({ length: dayCount }, (_, index) => index + 1).map((item) => (
                  <button
                    key={item}
                    type="button"
                    aria-pressed={day === item}
                    className={cn(
                      "grid aspect-square place-items-center rounded-md text-sm font-semibold transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      day === item &&
                        "bg-primary text-primary-foreground shadow-sm hover:bg-[var(--brand-strong)] hover:text-primary-foreground",
                    )}
                    onClick={() => setDay(item)}
                  >
                    {persianDigits.format(item)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-md bg-secondary/70 px-4 py-3">
              <span className="text-sm text-muted-foreground">تاریخ انتخاب‌شده</span>
              <strong className="text-primary">
                {persianDigits.format(day)} {monthNames[month - 1]} {persianDigits.format(year)}
              </strong>
            </div>
          </div>

          <ModalFooter className="border-t bg-muted/50 p-4">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              انصراف
            </Button>
            <Button type="button" onClick={confirmSelection}>
              <Check className="size-4" aria-hidden="true" />
              تأیید تاریخ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
