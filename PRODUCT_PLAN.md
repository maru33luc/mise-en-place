# Mise en Place Product Plan

> Updated: 2026-09-06
> Status: Phase 1-6 implemented; refinement and production hardening remain.

## Product vision

Mise en Place is a fine-dining kitchen operations platform with a New York Michelin-starred restaurant aesthetic. It coordinates the work behind service: recipes, menu composition, guest scaling, shopping quantities and daily preparation.

## Locked decisions

| Decision | Choice |
|---|---|
| Storage | In-memory for the current phase |
| UI language | English |
| Drag and drop | Native HTML5 API |
| Frontend | Angular 22 standalone components, Signals and strict TypeScript |
| Backend | Node.js, Express, Zod and JWT |

## Design system: Noir Gourmet NYC

- Gold: `#c9a96e`, light gold: `#d4b87a`.
- Void: `#080808`, card: `#111111`.
- Primary text: `#e8e0d0`, muted text: `#817767`, border: `#1e1e1e`.
- Display type: Playfair Display. Interface type: Inter.
- Responsive layouts target small phones, tablets and desktop widths without horizontal overflow.

## Implemented product scope

### Authentication

- `POST /api/auth/register`, `POST /api/auth/login` and authenticated `GET /api/auth/me`.
- In-memory users with bcrypt password hashing and JWT tokens.
- Angular auth service, local storage session, bearer interceptor, public guard and protected route guard.
- Cinematic login and registration screens.

### Navigation and home

- Public home landing page.
- Fixed, scroll-aware navbar with collection, daily menu and prep list links.
- Prep list pending-task badge.
- Responsive layout rules for mobile, tablet and desktop.

### Recipe collection

- Authenticated recipe CRUD with seed recipes visible to users.
- User-owned custom recipes isolated by authenticated user id.
- Recipe detail route with ingredient and portion view.
- Existing recipe cards, forms, validation, loading, alerts and delete confirmation retained.
- Recipe model supports `season`, `tags` and `servings` for filtering and scaling work.

### Prep list

- Authenticated task CRUD at `/api/prep-list`.
- Task name, ingredient, quantity, unit, technique, estimated minutes, priority, notes and status.
- Progress indicator, per-task stopwatch, status changes and archive completed tasks.

### Daily menu

- Authenticated date-based menu persistence at `/api/menu/:date`.
- Native drag and drop from recipe library into starters, mains and desserts.
- Guest count scaling and generated shopping list grouped by ingredient and unit.

## Routes

```text
/                 public home
/auth/login       public login
/auth/register    public registration
/recipes          protected recipe collection
/recipes/:id      protected recipe detail
/menu             protected daily menu builder
/prep-list        protected prep workflow
```

## API contract

Public endpoints:

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`

Protected endpoints require `Authorization: Bearer <token>`:

- `GET /api/auth/me`
- `GET|POST|PUT|DELETE /api/recipes` and `/api/recipes/:id`
- `GET /api/menu`, `GET|PUT|DELETE /api/menu/:date`
- `GET|POST|PUT|DELETE /api/prep-list` and `/api/prep-list/:id`
- `DELETE /api/prep-list/done`

All state is in memory and is cleared when the backend restarts.

## Architecture

```text
frontend/src/app/
  core/
    models/          domain contracts
    services/        auth, recipes, menu, prep list and toast state
    guards.ts        public and protected route guards
    interceptors/    bearer auth and error handling
  features/
    home/            public entry point
    auth/            login and registration
    recipes/         collection, cards, forms and detail
    menu/            daily menu and shopping list
    prep-list/       preparation tasks and timers
  shared/            navbar, alert, confirmation, loading and empty states

backend/
  controllers/       request handlers
  middleware/        auth and validation
  models/            in-memory domain stores
  routes/            API route registration
  schemas/           request validation
  server.js          strict environment configuration and HTTP entry point
```

## Environment and port policy

Create `backend/.env` from `backend/.env.example`. `PORT` is mandatory and the server always binds to that exact value. If it is invalid or occupied, startup fails; the server never increments or selects a fallback port.

The frontend API URL is configured in `frontend/src/environments/environment.ts` and should match the backend port.

## Quality checks

```bash
pnpm frontend:build
pnpm frontend:test
pnpm frontend:lint
pnpm backend:test
```

The frontend suite covers components, services, utilities and authentication UI. The backend suite uses Node's native test runner and exercises real HTTP requests against an ephemeral server: health, auth, protected routes, recipe CRUD, menu persistence and prep task updates.

## Next hardening work

- Add schema validation for menu and prep payloads.
- Add recipe search/filter controls and complete smart unit conversion.
- Persist timer elapsed time on update and derive prep tasks directly from menu recipes.
- Add an actual mobile navigation drawer and broader keyboard/accessibility coverage.
- Replace in-memory storage when persistence and multi-instance deployment are required.
