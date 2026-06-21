# Technical Architecture

## System context

The browser communicates only with the Next.js origin. Next.js serves UI routes and a Backend-for-Frontend layer, which calls the Go API over the private Docker network. PostgreSQL stores durable entities, Redis supports backend rate limiting and transient state, and a named volume stores uploads.

```text
Browser -> Nginx gateway -> Next.js App Router/BFF -> Go API -> PostgreSQL
                                      |              -> Redis
                                      |              -> upload volume
                                      -> encrypted HttpOnly session cookie
```

## Framework and language choices

- Next.js 16 App Router provides server components, nested layouts, route handlers, metadata, caching, and standalone production output.
- React 19 renders interactive client islands while pages and layouts remain server components by default.
- TypeScript strict mode checks application, test, configuration, and route-handler code.
- Tailwind CSS 4 generates utility styles. Reusable Radix-based primitives provide accessible interaction behavior.
- Vazirmatn Arabic and Latin subsets are self-hosted as WOFF2 with `font-display: swap` and immutable caching.

## Source layout

| Directory | Responsibility |
| --- | --- |
| `app/` | Routes, layouts, metadata, loading/error boundaries, and BFF route handlers |
| `components/` | Feature components, shared layout, providers, and reusable UI primitives |
| `config/` | Parsed public and server-only deployment configuration |
| `lib/` | Pure helpers plus server-only session, authorization, and backend transport code |
| `schemas/` | Zod validation and input normalization contracts |
| `services/api/` | Browser API modules, query keys, errors, and targeted invalidation |
| `services/server/` | Cached server-side public content reads |
| `services/mappers/` | Backend storage shape to frontend domain view conversion |
| `stores/` | Minimal token-free browser authentication state |
| `types/` | Backend-aligned domain and API TypeScript contracts |
| `tests/` and colocated tests | MSW integration and Playwright E2E coverage |

## Rendering model

Public pages favor static generation and timed revalidation. Blog lists and details use cache tags so administrator mutations can invalidate only public article data. Authenticated pages are dynamically rendered because server layouts must inspect the request cookie and role before returning content.

Client components are limited to forms, interactive tables, dialogs, browser providers, and charts. Recharts is dynamically imported on the statistics route. Global providers are isolated in one client boundary so the remaining route tree stays server-rendered.

## Authentication and BFF design

The browser posts OTP operations to same-origin route handlers under `/api/auth`. Verification responses contain backend access and refresh tokens, but route handlers encrypt the complete session using JWE before creating an HttpOnly cookie. Browser stores contain only user identity and authentication status.

Protected server layouts call server-only guards. The BFF proxy under `/api/v1/[...path]` forwards approved request headers, drops browser cookies and authorization headers, injects the server-held access token, and retries once after refresh. Refresh requests are single-flight per refresh token.

Mutating BFF routes validate the request origin. Proxy responses copy only an explicit header allow list. API routes return `no-store` headers to avoid caching personalized responses.

## Data and cache architecture

TanStack Query is the only browser server-state cache. Query-key factories define entity namespaces. Mutations invalidate explicit dependencies rather than clearing the entire cache. Default stale time, garbage-collection time, retry count, and focus behavior are parsed from public deployment configuration.

Zustand stores only visible authentication state. It never stores backend records or credentials. Cross-tab logout uses a browser channel so all tabs converge on unauthenticated state.

Server-side public content uses Next.js fetch caching:

- marketing pages are statically rendered;
- articles use five-minute revalidation plus article tags;
- majors and subjects use long revalidation windows;
- authenticated backend reads always use `no-store`.

## Forms and validation

React Hook Form controls form lifecycle without rerendering the full page on every input. Zod schemas provide input types, normalized output types, Persian validation messages, numeric consistency rules, Jalali formatting, and JSON option checks.

Dynamic fields use one definition contract, renderer, and validator across student profiles, exams, and mistakes. Backend definitions remain authoritative; the frontend adds usability validation but does not replace server validation.

## Content and upload security

Article HTML is sanitized with a strict tag, attribute, and URL-scheme allow list. External links receive safe `rel` values. JSON-LD escapes HTML delimiters before entering a script element.

Profile and document uploads are validated in the form and again in the BFF. The BFF checks multipart encoding, upload kind, file count, total payload size, per-file size, exact MIME allow lists, and JPEG/PNG/WebP/PDF magic signatures before forwarding bytes to the backend.

## Observability

The client reports LCP, CLS, and INP through `navigator.sendBeacon`. React route boundaries report only error name, route path without query parameters, and an opaque digest. `/api/telemetry` accepts at most 2 KB of same-origin JSON, applies an allow list, and writes structured container output without headers, stack traces, tokens, or user identity.

## Performance controls

The production build enables compression, AVIF/WebP image formats, strict React behavior, standalone output, and immutable font caching. A post-build script enforces initial gzip JavaScript, individual image, and total font budgets. Current targets are LCP below 2.5 seconds, CLS below 0.1, and INP below 200 milliseconds on a mid-range mobile device.

## Production-only mode

Application behavior has no environment selector. Server configuration exports production behavior unconditionally, runtime secrets are mandatory, automatic session cookies are secure, and developer-only runtime packages are absent. Local Docker verification can explicitly disable the Secure cookie attribute because the local gateway uses HTTP; this is a transport setting, not a development application mode.
