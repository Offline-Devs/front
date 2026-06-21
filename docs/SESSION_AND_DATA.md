# Session and Data Infrastructure

## Session boundary

The browser calls same-origin `/api/auth/*` and `/api/v1/*` routes. Backend tokens never enter browser JavaScript. The BFF stores access token, refresh token, expiry, and user in an encrypted AES-256-GCM JWE cookie with HttpOnly, SameSite, Secure-in-production, path, priority, and max-age controls.

`BFF_SESSION_SECRET` is mandatory and at least 32 characters in production. Logout expires the cookie, clears React Query and Zustand state, and broadcasts a logout event to other tabs.

## Refresh policy

The gateway refreshes proactively near access expiry and retries one backend 401. Concurrent requests sharing a refresh token use one refresh promise. A failed refresh expires the session and returns the backend 401.

## Authorization

Student and admin layouts verify the encrypted session on the server. Role mismatches redirect to `/forbidden`. Student routes also distinguish a missing profile (404) from availability failures and redirect only a real 404 to `/complete-profile`. Backend authorization remains final for every API request.

## Error and retry policy

`ApiError` maps backend status and messages to controlled Persian UI text. React Query retries only retryable transport/server failures. Validation, authorization, forbidden, and not-found responses are not retried. Offline state is announced globally without discarding form state.

## Data mapping and invalidation

Response mappers normalize Jalali dates, missing arrays, dynamic-field options, performance attachments, and upload URLs. Mutation dependencies are centralized in `services/api/invalidation.ts`; features invalidate only affected entity, summary, and statistics branches.

## Verification

Tests cover encrypted session round-trip and tampering, refresh single-flight, terminal 401 state cleanup, 401/403/404/429 policy, malformed JSON fallback, cross-tab logout, and Design System accessibility.
