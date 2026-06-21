# API Integration

## Network boundary

Browser requests target `/api/v1` on the frontend origin. The catch-all BFF route maps that path to the private backend base URL configured by `API_BASE_URL`. In Docker, the value is `http://backend:8080`; the backend is not published to the browser.

## Public backend resources

- `GET /blog` and `GET /blog/:slug` provide published article content.
- `GET /majors` and `GET /subjects?major=...` provide academic reference data.
- `POST /auth/request-otp`, `POST /auth/verify-otp`, and `POST /auth/refresh` support authentication.

Public server-component reads use `services/server/public-content.ts`. Interactive browser operations use the same-origin BFF.

## Student resources

- `/students/profile`: create, read, and update the current profile.
- `/students/dashboard`: approval and recent-activity summary.
- `/exams` and `/exams/:id`: current-student exam CRUD.
- `/mistakes` and `/mistakes/:id`: current-student mistake CRUD.
- `/statistics`: current-student aggregates with optional Jalali date range.
- `/performance`: current-student read-only advisor history.
- `/upload` and `/upload/multiple`: authenticated profile or document uploads.

## Administrator resources

- `/admin/students/with-stats`: paginated student list used by the UI.
- `/admin/students/:id`: profile inspection and mutation.
- `/admin/students/:id/approve`: approval state changes.
- Administrator student subresources expose exams, mistakes, statistics, and performance.
- `/admin/blog`: article CRUD and publication lifecycle.
- `/admin/dynamic-fields`: dynamic definition CRUD.

## Request pipeline

1. A feature module calls `apiRequest` with an API-relative path.
2. `apiRequest` prefixes `NEXT_PUBLIC_API_BASE_PATH`, adds JSON content type unless the body is FormData, and sends same-origin credentials.
3. The BFF validates mutation origin and strips unsafe forwarding headers.
4. The BFF decrypts the session cookie and adds the bearer token server-side.
5. The backend response is reduced to approved response headers and returned to the browser.
6. A 401 triggers one token-refresh attempt; terminal failure clears the session.

## Error handling

Non-success responses become `ApiError` instances with status, stable code, retryability, and a controlled Persian message. Feature components render consistent retry, empty, and permission states. Backend error text is never injected into HTML.

## Cache invalidation

- Profile mutations invalidate profile and dashboard dependencies.
- Exam mutations invalidate exam lists/details, dashboard summary, and statistics.
- Mistake mutations invalidate mistake lists and dependent statistics.
- Administrator student mutations invalidate the affected record and list.
- Article mutations invalidate administrator queries and trigger public cache-tag revalidation.

## Contract maintenance

Backend JSON models are represented in `types/`. Mutation schemas live in `schemas/`. Storage inconsistencies such as JSON strings are isolated in `services/mappers/`. When a backend response changes, update the type, mapper, MSW handler, fixture, and integration test together before modifying UI components.
