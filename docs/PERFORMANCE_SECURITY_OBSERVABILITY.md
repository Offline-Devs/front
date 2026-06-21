# Performance, security and observability

## Performance contract

- Runtime targets on a mid-range mobile device: LCP < 2.5s, CLS < 0.1 and INP < 200ms.
- `npm run performance:check` enforces gzip initial-JS, per-image and total-font budgets after every production build.
- Charts and query devtools are lazy chunks. Static files and local fonts use immutable caching; API responses are `no-store`.
- Next image formats prefer AVIF/WebP. New content images must use `next/image` with explicit dimensions; below-the-fold media stays lazy and non-critical links may disable prefetch.

## Security contract

- Global headers enforce CSP, frame denial, MIME sniffing denial, limited browser permissions and strict referrer handling.
- Article HTML is allow-list sanitized. JSON-LD escapes HTML delimiters.
- BFF mutations require same-origin requests. Uploads are checked again at the BFF for multipart encoding, exact MIME allow lists, count and byte limits before forwarding.
- Tokens remain in encrypted HttpOnly session cookies. Telemetry never accepts headers, stack traces, arbitrary metadata or identity fields.

## Observability contract

- The client reports LCP, CLS and INP plus render-boundary failures to `/api/telemetry` with `sendBeacon`.
- The endpoint accepts at most 2KB of same-origin JSON and writes an allow-listed structured event suitable for the container log collector.
- Production alerting should aggregate `poor` Web Vitals and `error` events by release and route. Do not add user IDs, contact data, request bodies or tokens.

## Verification

Run `npm run quality`. Review CSP in a production response and test uploads against both the BFF and backend limits before deployment.
