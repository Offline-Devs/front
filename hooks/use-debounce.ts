"use client";
import { useEffect, useState } from "react";
// debounce ورودی‌های جست‌وجو برای جلوگیری از درخواست اضافه.
export function useDebounce<T>(value: T, delay = 300) { const [result, setResult] = useState(value); useEffect(() => { const id = setTimeout(() => setResult(value), delay); return () => clearTimeout(id); }, [value, delay]); return result; }
