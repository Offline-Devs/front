# Security and Quality

## Security controls

- JWE-encrypted, HttpOnly, same-site sessions keep tokens out of JavaScript.
- Same-origin checks protect mutating BFF routes.
- CSP restricts script, style, image, font, connection, form, frame, and object sources.
- Referrer policy, MIME sniffing prevention, frame denial, browser permission restrictions, and opener isolation are applied globally.
- Article sanitization and escaped JSON-LD prevent untrusted HTML execution.
- Upload policy validates metadata and binary signatures before proxying files.
- Telemetry uses a strict allow list and excludes PII, request data, credentials, and stack traces.

## Automated test layers

- Unit tests cover schemas, formatters, Jalali conversion, mappers, cache helpers, session encryption, upload policy, and error mapping.
- Component tests cover forms, asynchronous tables, dialogs, and design primitives.
- MSW integration tests verify feature API behavior at the browser transport boundary.
- Playwright verifies student and administrator critical paths on desktop Chromium and a mobile viewport.
- axe-core checks critical WCAG A/AA violations; additional tests cover keyboard focus and reduced motion.

## Required gate

`npm run quality` must pass before merging or deploying. CI repeats the same command on Node.js 22 and installs the pinned Playwright Chromium runtime.

Performance budgets fail the build when initial gzip JavaScript, an individual public image, or total fonts exceed configured thresholds. Changes to a budget require a documented architectural reason; raising a threshold is not a substitute for investigating bundle growth.

## Dependency policy

Runtime dependencies must have a production import. Test/build-only packages belong in devDependencies. Run `npx knip` during structural cleanup and manually review framework entry points before deletion because convention-based files and Playwright subprocesses may not appear in the static import graph.
