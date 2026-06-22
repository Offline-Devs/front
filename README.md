# Noshirvani Academy Frontend

Production-only Persian RTL web application for exam tracking, mistake analysis, academic
performance reporting, and student administration.

## Runtime stack

- Next.js 16 App Router, React 19, and TypeScript in strict mode
- Tailwind CSS 4 with locally hosted Vazirmatn variable fonts
- TanStack Query for remote server state and Zustand for token-free authentication UI state
- React Hook Form and Zod for typed forms and validation
- Radix UI primitives, Lucide icons, Recharts, and Sonner notifications
- HttpOnly encrypted BFF session cookies; browser code never receives access or refresh tokens
- Vitest, Testing Library, MSW, Playwright, and axe-core

## Start the complete system

Docker is the supported runtime. From this directory:

```bash
docker compose up --build -d
docker compose ps
```

Open `http://localhost`. The Compose project starts PostgreSQL, Redis, the Go backend, the Next.js
frontend, and the Nginx gateway. Stop it with `docker compose down`; add `-v` only when persisted
database, Redis, and upload data should be deleted.

## Quality gate

```bash
npm ci
npm run quality
```

The quality command runs strict type checking, ESLint, 63+ automated tests, a production build,
performance budgets, and desktop/mobile E2E scenarios.

## Documentation

- [User flows](docs/USER_FLOWS.md)
- [Technical architecture](docs/TECHNICAL_ARCHITECTURE.md)
- [API integration](docs/API_INTEGRATION.md)
- [Operations and Docker](docs/OPERATIONS.md)
- [Security and quality](docs/SECURITY_AND_QUALITY.md)

The application mode is permanently production. There is no application environment switch or
development runtime script. Configuration variables customize deployment values, not runtime
behavior.
