/**
 * @file tests/setup.ts
 * @description Global Vitest test environment setup.
 *
 * Runs before every test file. Responsibilities:
 *   - Imports @testing-library/jest-dom/vitest to register custom matchers
 *     (toBeInTheDocument, toHaveAttribute, etc.).
 *   - Sets required server-only environment variables (BFF_SESSION_SECRET,
 *     BFF_SESSION_COOKIE_SECURE) so server module imports do not throw.
 *   - Starts / resets / stops the MSW mock server around each test.
 *   - Polyfills crypto.subtle for the session-codec tests running in jsdom.
 *   - Polyfills ResizeObserver and PointerEvent for Radix UI components.
 *   - Polyfills window.matchMedia for theme-toggle tests.
 */
import "@testing-library/jest-dom/vitest";
process.env.BFF_SESSION_SECRET = "test-session-secret-with-at-least-32-characters";
process.env.BFF_SESSION_COOKIE_SECURE = "false";
import { webcrypto } from "node:crypto";
import { afterAll, afterEach, beforeAll } from "vitest";
import { mockServer } from "./mocks/server";

beforeAll(() => mockServer.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

if (!globalThis.crypto?.subtle) Object.defineProperty(globalThis, "crypto", { value: webcrypto });

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock;
if (typeof MouseEvent !== "undefined") global.PointerEvent = MouseEvent as typeof PointerEvent;
if (typeof window !== "undefined")
  window.matchMedia =
    window.matchMedia ??
    (() => ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }));
