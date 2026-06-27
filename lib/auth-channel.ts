/**
 * @file lib/auth-channel.ts
 * @description Cross-tab authentication event bus.
 *
 * Uses BroadcastChannel when available (same browser, all tabs), with a
 * localStorage fallback for browsers or scenarios where BroadcastChannel is
 * unavailable (e.g. iframe isolation).
 *
 * Supported events:
 *   "logout"          — clears the TanStack Query cache and marks the auth store
 *                       as unauthenticated in all open tabs.
 *   "session-updated" — triggers a re-fetch of the session query key so a
 *                       freshly refreshed token is picked up everywhere.
 *
 * broadcastAuthEvent(event) — fires an event from the current tab.
 * subscribeToAuthEvents(listener) — subscribes to events and returns an
 *   unsubscribe function for use in useEffect cleanup.
 */
type AuthEvent = "logout" | "session-updated";
const channelName = "noshirvani-auth";
const storageKey = "noshirvani:auth-event";

export function broadcastAuthEvent(event: AuthEvent) {
  if (typeof window === "undefined") return;
  if ("BroadcastChannel" in window) {
    const channel = new BroadcastChannel(channelName);
    channel.postMessage(event);
    channel.close();
  }
  localStorage.setItem(storageKey, JSON.stringify({ event, at: Date.now() }));
}
export function subscribeToAuthEvents(listener: (event: AuthEvent) => void) {
  if (typeof window === "undefined") return () => undefined;
  const channel = "BroadcastChannel" in window ? new BroadcastChannel(channelName) : null;
  if (channel)
    channel.onmessage = ({ data }) => {
      if (data === "logout" || data === "session-updated") listener(data);
    };
  const onStorage = (event: StorageEvent) => {
    if (event.key !== storageKey || !event.newValue) return;
    try {
      const value = JSON.parse(event.newValue) as { event?: AuthEvent };
      if (value.event) listener(value.event);
    } catch {}
  };
  window.addEventListener("storage", onStorage);
  return () => {
    channel?.close();
    window.removeEventListener("storage", onStorage);
  };
}
