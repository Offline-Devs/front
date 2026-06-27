/**
 * @file vitest.config.ts
 * @description Vitest unit and component test runner configuration.
 *
 * Uses the @vitejs/plugin-react plugin for JSX transform support.
 * Environment: jsdom (simulates browser APIs for component tests).
 * Setup file: tests/setup.ts bootstraps @testing-library/jest-dom matchers,
 *   MSW mock server lifecycle, ResizeObserver / PointerEvent polyfills, and
 *   the crypto.subtle polyfill required by the session-codec tests.
 * Path aliases: mirrors the tsconfig @/* → project root mapping.
 */
import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, ".") } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    css: false,
  },
});
