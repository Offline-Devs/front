import { describe, expect, it, vi } from "vitest";
import { subscribeToAuthEvents } from "./auth-channel";

describe("cross-tab auth events", () => {
  it("receives a logout written by another tab", () => { const listener = vi.fn(); const unsubscribe = subscribeToAuthEvents(listener); window.dispatchEvent(new StorageEvent("storage", { key: "noshirvani:auth-event", newValue: JSON.stringify({ event: "logout", at: Date.now() }) })); expect(listener).toHaveBeenCalledWith("logout"); unsubscribe(); });
});
