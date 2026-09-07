# Backend

Express API for Mise en Place. The server uses in-memory models and JWT authentication for the current product phase.

## Setup

```bash
pnpm install
copy .env.example .env
pnpm start
```

`PORT` is required in `.env` and is the only port the server uses. If the port is invalid or occupied, the process exits with an error instead of selecting another port.

## Environment

| Variable | Purpose |
|---|---|
| `PORT` | Required listening port |
| `ALLOWED_ORIGIN` | Frontend origin allowed by CORS |
| `JWT_SECRET` | Signing secret for tokens |
| `JWT_EXPIRES` | Token lifetime |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window |
| `RATE_LIMIT_MAX` | Maximum requests per window |
| `BODY_LIMIT` | JSON request size limit; use at least `5mb` for local recipe image uploads |

See `.env.example` for the defaults used in local development.

## Tests

The backend integration suite uses Node's built-in `node:test` runner and starts the API on an ephemeral port, so it does not require a running `.env` server.

```bash
pnpm test
```

## API

Public:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/health`

Authenticated:

- `GET /api/auth/me`
- `GET|POST|PUT|DELETE /api/recipes`
- `GET|PUT|DELETE /api/menu/:date`
- `GET|POST|PUT|DELETE /api/prep-list`

Authenticated requests must send `Authorization: Bearer <token>`.
