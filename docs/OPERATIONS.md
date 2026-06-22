# Operations and Docker

## Services

The frontend Compose file is the canonical local and integration topology:

| Service    | Purpose                             | Published port |
| ---------- | ----------------------------------- | -------------- |
| `postgres` | Durable backend database            | none           |
| `redis`    | Backend transient/rate-limit state  | none           |
| `backend`  | Go HTTP API                         | none           |
| `web`      | Next.js standalone frontend and BFF | none           |
| `gateway`  | Public Nginx reverse proxy          | `80`           |

Only the gateway is publicly exposed. Service health checks enforce PostgreSQL -> Redis -> backend
-> frontend -> gateway startup readiness.

## Commands

```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f web backend
docker compose down
```

Use `docker compose down -v` only for an intentional destructive reset of database, Redis, and
uploaded files.

## Production configuration

Copy `.env.example` only as a reference; never commit real values. Required deployment secrets
include a random BFF session secret of at least 32 characters and strong independent backend JWT
access/refresh secrets. Use HTTPS and leave `BFF_SESSION_COOKIE_SECURE=auto` or `true` outside local
HTTP verification.

Public `NEXT_PUBLIC_*` values are compiled into browser assets and are not secrets. Rebuild the web
image after changing them. Server-only values are read when the container starts.

The application mode is fixed to production. `NODE_ENV=production` is set in the runtime image, and
there is no APP_ENV or NEXT_PUBLIC_APP_ENV switch.

## Persistence and backup

- `postgres_data` contains application records and requires database-aware backups.
- `redis_data` contains Redis append-only state but is not a replacement for PostgreSQL backup.
- `uploads` contains user files and must be backed up consistently with database attachment
  references.

## Deployment health verification

1. Confirm all Compose services are healthy.
2. Request `http://localhost/` and verify an HTTP 200 response with CSP and MIME-protection headers.
3. Request a public BFF resource such as `http://localhost/api/v1/majors` and confirm a backend JSON
   response.
4. Execute OTP request/verification in mock mode and verify the browser receives an HttpOnly session
   cookie without token fields in JSON.
5. Review `docker compose logs` and confirm no token, cookie, request body, phone, or email appears.

## Scaling notes

The standalone web container is stateless except for its encrypted cookie secret and can be
replicated behind a load balancer. Backend uploads currently use a shared filesystem volume;
multiple backend replicas require shared object storage or a shared filesystem. PostgreSQL and Redis
should use managed or highly available deployments for production traffic.
