# Mise en Place

A fine-dining kitchen operations platform for recipes, daily menu planning and service preparation.

## Current stack

- Backend: Node.js, Express, Zod, JWT, in-memory storage.
- Frontend: Angular 22 standalone components, Signals, TypeScript 6 and Vitest.
- Package manager: pnpm.
- UI: English, Noir Gourmet NYC design system.

## Requirements

- Node.js 20 or newer.
- pnpm 9 or newer.

## Setup

Install dependencies:

```bash
pnpm install
pnpm backend:install
pnpm frontend:install
```

Create `backend/.env` from `backend/.env.example` and set `PORT`. The backend always binds to that exact port. It does not move to another port when the configured port is occupied.

Start the services in separate terminals:

```bash
pnpm backend:start
pnpm frontend:start
```

The API is available at `http://localhost:<PORT>` and the Angular app at `http://localhost:4200`.

## Workspace commands

```bash
pnpm frontend:build
pnpm frontend:test
pnpm frontend:lint
```

## Product documentation

The complete product definition, implemented features, architecture, routes, API contract and remaining work live in [PRODUCT_PLAN.md](PRODUCT_PLAN.md).

## API overview

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET|POST|PUT|DELETE /api/recipes`
- `GET|PUT|DELETE /api/menu/:date`
- `GET|POST|PUT|DELETE /api/prep-list`
- `GET /api/health`

Protected routes require `Authorization: Bearer <token>`.

## Storage

Data is intentionally in memory for the current product phase. Restarting the backend clears users, custom recipes, menus and prep tasks.
