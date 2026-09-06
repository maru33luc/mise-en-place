<div align="center">

# <span style="color:#c9a96e">Mise en Place</span>

### <span style="color:#e8e0d0">The quiet architecture behind an extraordinary service.</span>

A fine-dining kitchen operations platform for recipes, menu composition, guest scaling and daily preparation.

<br />

[![Angular](https://img.shields.io/badge/Angular-22-dd0031?style=for-the-badge&logo=angular&logoColor=ffffff)](https://angular.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=ffffff)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-111111?style=for-the-badge&logo=express&logoColor=c9a96e)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=ffffff)](https://www.typescriptlang.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9%2B-f69220?style=for-the-badge&logo=pnpm&logoColor=ffffff)](https://pnpm.io/)

<br />

**English UI** · **Noir Gourmet NYC** · **Native HTML5 drag and drop** · **In-memory by design**

</div>

---

## ✦ What is Mise en Place?

Mise en Place is a dark, editorial kitchen management workspace inspired by a New York Michelin-starred restaurant. It brings the operational layer of service into one focused experience:

- Build and maintain a personal recipe collection.
- Compose a daily menu across starters, mains and desserts.
- Scale ingredient quantities to the expected guest count.
- Generate a consolidated shopping list from the menu.
- Organize prep tasks, priorities, progress and timers before service.

> **Product principle:** every screen should help a kitchen team move from intention to execution with less friction.

## ◈ Product Tour

| Area | What it does |
|---|---|
| 🏛️ **Home** | Public cinematic entry point with a direct path into the kitchen. |
| 🔐 **Authentication** | Register, sign in and maintain a JWT-backed in-memory session. |
| 🍽️ **Recipe Collection** | Create, edit, delete and inspect recipes with ingredients and difficulty. |
| 📖 **Recipe Detail** | View a recipe and its ingredient quantities by portion. |
| 🧭 **Daily Menu** | Drag recipes into **Starters**, **Mains** or **Desserts** for a service date. |
| 🛒 **Shopping List** | Aggregate menu ingredients and scale them to guest count. |
| ⏱️ **Prep List** | Track tasks, priorities, completion progress and per-task stopwatches. |
| 📱 **Responsive UI** | Adapted layouts for phones, tablets and desktop screens. |

## ✧ Visual Language

The interface follows the **Noir Gourmet NYC** design system: cinematic photography, restrained gold accents and dense operational layouts.

<table>
  <tr>
    <th align="left">Token</th>
    <th align="left">Value</th>
    <th align="left">Role</th>
  </tr>
  <tr>
    <td><code>--gold</code></td>
    <td><span style="color:#c9a96e">#c9a96e</span></td>
    <td>Primary accent, actions and highlights</td>
  </tr>
  <tr>
    <td><code>--gold-light</code></td>
    <td><span style="color:#d4b87a">#d4b87a</span></td>
    <td>Hover states and secondary accents</td>
  </tr>
  <tr>
    <td><code>--bg-void</code></td>
    <td><span style="color:#080808">#080808</span></td>
    <td>Application canvas</td>
  </tr>
  <tr>
    <td><code>--bg-card</code></td>
    <td><span style="color:#111111">#111111</span></td>
    <td>Panels and framed tools</td>
  </tr>
  <tr>
    <td><code>--text-primary</code></td>
    <td><span style="color:#e8e0d0">#e8e0d0</span></td>
    <td>Headings and primary content</td>
  </tr>
  <tr>
    <td><code>--text-muted</code></td>
    <td><span style="color:#817767">#817767</span></td>
    <td>Supporting content and metadata</td>
  </tr>
</table>

Typography pairs **Playfair Display** for editorial headings with **Inter** for precise interface copy.

## 🧰 Technology Stack

### Frontend

| Technology | Use |
|---|---|
| **Angular 22** | Standalone application architecture and lazy-loaded routes |
| **TypeScript 6** | Strictly typed application code |
| **Angular Signals** | Local and shared reactive state |
| **Angular Router** | Public/protected navigation and route guards |
| **Angular HttpClient** | API communication and interceptor pipeline |
| **Angular Forms** | Login, registration, recipe, menu and prep forms |
| **RxJS** | HTTP streams, error handling and lifecycle operators |
| **Vitest** | Component, service and utility tests |
| **ESLint + angular-eslint** | Static analysis and code quality |
| **Prettier** | Formatting for frontend source files |
| **Native HTML5 DnD** | Menu builder interactions without CDK dependency |

### Backend

| Technology | Use |
|---|---|
| **Node.js 20+** | Runtime |
| **Express 4** | HTTP server and route composition |
| **Zod** | Recipe request validation |
| **JSON Web Token** | Bearer token authentication |
| **bcryptjs** | Password hashing |
| **Helmet** | Security-related HTTP headers |
| **CORS** | Controlled frontend origin access |
| **express-rate-limit** | API request throttling |
| **In-memory models** | Fast local product iteration without a database |

### Engineering choices

- Standalone Angular components instead of NgModules.
- Signals for application state where a full state library is unnecessary.
- HTTP services separated from state stores.
- Auth and error behavior centralized in interceptors.
- Native browser drag and drop for a small dependency surface.
- Strict configured port: the backend never silently switches ports.

## 🗺️ Application Routes

| Route | Access | Screen |
|---|---|---|
| `/` | Public | Cinematic home |
| `/auth/login` | Public | Sign in |
| `/auth/register` | Public | Create account |
| `/recipes` | Protected | Recipe collection |
| `/recipes/:id` | Protected | Recipe detail |
| `/menu` | Protected | Daily menu builder |
| `/prep-list` | Protected | Service preparation workspace |

## 🧱 Project Structure

```text
mise-en-place/
├── backend/
│   ├── controllers/       HTTP request handlers
│   ├── middleware/        Authentication and validation
│   ├── models/            In-memory users, recipes, menus and prep tasks
│   ├── routes/            API route registration
│   ├── schemas/           Zod request schemas
│   ├── .env.example       Local environment template
│   ├── app.http           REST Client requests
│   └── server.js          API entry point
├── frontend/
│   ├── src/app/core/      Models, services, guards and interceptors
│   ├── src/app/features/  Home, auth, recipes, menu and prep list
│   ├── src/app/shared/    Navbar, alerts, dialogs and loading states
│   ├── src/environments/  API URL configuration
│   └── angular.json       Angular workspace configuration
├── PRODUCT_PLAN.md        Product definition and implementation record
├── package.json           Root workspace commands
└── pnpm-lock.yaml         Root dependency lockfile
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 20 or newer**
- **pnpm 9 or newer**
- A browser with support for modern JavaScript and HTML5 drag and drop

Check your local versions:

```bash
node --version
pnpm --version
```

### 1. Install dependencies

From the repository root:

```bash
pnpm install
pnpm backend:install
pnpm frontend:install
```

### 2. Configure the backend

Create the environment file:

```bash
copy backend\.env.example backend\.env
```

On macOS/Linux:

```bash
cp backend/.env.example backend/.env
```

The backend reads `PORT` from `backend/.env` and binds to that exact port.

### 3. Start the backend

In terminal one:

```bash
pnpm backend:start
```

Expected local URL:

```text
http://localhost:3000
```

If `PORT` is changed, update the frontend API URL in `frontend/src/environments/environment.ts` to match it. If the configured port is occupied, startup fails with `EADDRINUSE`; no fallback port is selected.

### 4. Start the frontend

In terminal two:

```bash
pnpm frontend:start
```

Open:

```text
http://localhost:4200
```

## ⌘ Command Reference

### Root workspace commands

| Command | Purpose |
|---|---|
| `pnpm backend:install` | Install backend dependencies |
| `pnpm frontend:install` | Install frontend dependencies |
| `pnpm backend:start` | Start the Express API using `.env` |
| `pnpm frontend:start` | Start Angular dev server |
| `pnpm frontend:build` | Create a production frontend build |
| `pnpm frontend:test` | Run frontend tests once |
| `pnpm frontend:lint` | Run ESLint |

### Frontend commands

Run from `frontend/` when you need Angular-specific tools:

```bash
pnpm start
pnpm build
pnpm test
pnpm lint
pnpm format
pnpm format:check
```

### Backend commands

Run from `backend/`:

```bash
pnpm start
pnpm dev
```

`start` and `dev` both load `.env` through Node's `--env-file` support.

## 🔌 API Reference

### Public endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | API health check |
| `POST` | `/api/auth/register` | Create an in-memory user and return a token |
| `POST` | `/api/auth/login` | Authenticate a user and return a token |

### Authenticated endpoints

Send the header:

```http
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/auth/me` | Return the current user |
| `GET` | `/api/recipes` | List seed and user-owned recipes |
| `GET` | `/api/recipes/:id` | Get one recipe |
| `POST` | `/api/recipes` | Create a recipe |
| `PUT` | `/api/recipes/:id` | Update a user-owned recipe |
| `DELETE` | `/api/recipes/:id` | Delete a user-owned recipe |
| `GET` | `/api/menu` | List saved menus |
| `GET` | `/api/menu/:date` | Get a menu by ISO date |
| `PUT` | `/api/menu/:date` | Create or update a daily menu |
| `DELETE` | `/api/menu/:date` | Delete a daily menu |
| `GET` | `/api/prep-list` | List preparation tasks |
| `POST` | `/api/prep-list` | Create a preparation task |
| `PUT` | `/api/prep-list/:id` | Update task status or details |
| `DELETE` | `/api/prep-list/:id` | Delete a task |
| `DELETE` | `/api/prep-list/done` | Archive completed tasks |

### Recipe payload example

```json
{
  "title": "Pasta Carbonara",
  "description": "A classic Roman pasta dish.",
  "difficulty": "medium",
  "season": "all",
  "tags": ["protein", "gluten-free"],
  "servings": 4,
  "ingredients": [
    { "name": "Pasta", "amount": 400, "unit": "g" },
    { "name": "Egg yolks", "amount": 4, "unit": "unit" }
  ]
}
```

## 🔐 Environment Variables

Copy `backend/.env.example` to `backend/.env` and adjust values for your machine.

| Variable | Default | Purpose |
|---|---:|---|
| `PORT` | `3000` | Required API listening port |
| `ALLOWED_ORIGIN` | `http://localhost:4200` | CORS frontend origin |
| `JWT_SECRET` | Development fallback | Token signing secret; set a strong value outside local development |
| `JWT_EXPIRES` | `7d` | Token lifetime |
| `RATE_LIMIT_WINDOW_MS` | `60000` | Rate-limit window in milliseconds |
| `RATE_LIMIT_MAX` | `100` | Requests allowed per window |
| `BODY_LIMIT` | `10kb` | Maximum JSON body size |

> ⚠️ `backend/.env` is ignored by Git. Never commit production secrets.

## 🧪 Quality Gates

Run the complete frontend verification set:

```bash
pnpm frontend:build
pnpm frontend:test
pnpm frontend:lint
```

Current baseline:

- ✅ Production build succeeds.
- ✅ 38 frontend tests pass.
- ✅ ESLint passes.
- ✅ Strict TypeScript and Angular template checks pass.

## 🧭 Current Scope and Next Steps

The current phase intentionally uses in-memory storage. Restarting the backend clears users, custom recipes, menus and prep tasks.

Planned hardening work:

- Add backend integration tests and schemas for menu and prep payloads.
- Complete advanced recipe filtering and smart unit conversion.
- Persist timer elapsed time between updates.
- Derive prep tasks automatically from menu recipes.
- Add durable storage for production and multi-instance deployment.
- Expand keyboard navigation and accessibility coverage.

## 📚 Documentation Map

- [Product plan and architecture](PRODUCT_PLAN.md)
- [Backend guide](backend/README.md)
- [Frontend guide](frontend/README.md)
- [REST Client requests](backend/app.http)

<div align="center">

---

<span style="color:#c9a96e">Built for the work behind the service.</span>

</div>
