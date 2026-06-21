import { z } from "zod";
import { normalizeNumericInput } from "@/lib/auth-flow";
export const performanceSchema = z.object({ jalali_date: z.string().transform((value) => normalizeNumericInput(value).replace(/-/g, "/")).refine((value) => /^1[34]\d{2}\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])$/.test(value), "تاریخ معتبر وارد کنید."), notes: z.string().trim(), study_plan: z.string().trim(), files: z.array(z.string()) }).refine((value) => value.notes.length > 0 || value.study_plan.length > 0, { path: ["notes"], message: "حداقل یادداشت یا برنامه مطالعاتی را وارد کنید." });
export type PerformanceFormValues = z.input<typeof performanceSchema>;
export type PerformanceFormOutput = z.output<typeof performanceSchema>;
