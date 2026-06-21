import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/services/api/client";

export function ApiErrorState({ error, retry }: { error: unknown; retry?: () => void }) { const message = error instanceof ApiError ? error.message : "خطای پیش‌بینی‌نشده‌ای رخ داد."; const retryable = error instanceof ApiError ? error.retryable : true; return <div role="alert" className="grid justify-items-center gap-3 rounded-lg border border-destructive/25 bg-destructive/5 p-8 text-center"><AlertCircle className="size-10 text-destructive" aria-hidden="true" /><p className="font-bold">{message}</p>{retry && retryable && <Button variant="outline" onClick={retry}>تلاش دوباره</Button>}</div>; }
