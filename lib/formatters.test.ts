import { describe, expect, it } from "vitest";
import { formatDate, formatFileSize, formatNumber } from "./formatters";
describe("Persian formatters", () => { it("formats numbers with Persian locale", () => { expect(formatNumber(1234)).toMatch(/[۱٢۲]/u); }); it("formats file sizes in MB", () => { expect(formatFileSize(1_048_576)).toBe("1.0 MB"); }); it("formats a stable date without throwing", () => { expect(formatDate("2026-06-21T00:00:00Z")).toBeTruthy(); }); });
