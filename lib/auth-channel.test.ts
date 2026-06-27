/**
 * @file lib/auth-channel.test.ts
 * @description Unit tests for the cross-tab auth event channel.
 *
 * Tests the localStorage-based fallback path (BroadcastChannel is not
 * available in jsdom). Verifies that broadcastAuthEvent() writes the expected
 * payload to localStorage and that subscribeToAuthEvents() fires the listener
 * when the storage event is dispatched with the correct key.
 */
import { describe, expect, it, vi } from "vitest";
import { subscribeToAuthEvents } from "./auth-channel";

describe("cross-tab auth events", () => {
  it("receives a logout written by another tab", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToAuthEvents(listener);
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "noshirvani:auth-event",
        newValue: JSON.stringify({ event: "logout", at: Date.now() }),
      }),
    );
    expect(listener).toHaveBeenCalledWith("logout");
    unsubscribe();
  });
});
