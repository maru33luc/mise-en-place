# Mise en Place — Fine Dining Digital Platform · Product Plan

> Last updated: 2026-09-06  
> Status: **Approved & In Progress**

---

## Decisions Locked

| Decision | Choice |
|----------|--------|
| Database | **In-memory** (no MongoDB for now) |
| UI Language | **English** |
| Drag & Drop | **Native HTML5 API** (no CDK) |

---

## Vision

**Mise en Place** is a luxury fine-dining kitchen management platform with the aesthetic of a New York Michelin-starred restaurant. It solves the real problem of professional culinary planning and service execution — going far beyond a simple recipe CRUD.

---

## Design System — "Noir Gourmet NYC"

| Token | Value |
|-------|-------|
| `--gold` | `#c9a96e` |
| `--gold-light` | `#d4b87a` |
| `--bg-void` | `#080808` |
| `--bg-card` | `#111111` |
| `--text-primary` | `#e8e0d0` |
| `--text-muted` | `#666` |
| `--border` | `#1e1e1e` |
| `--serif` | Cormorant Garamond / Playfair Display |
| `--sans` | Inter |

---

## Feature Set

### 1. Auth — Register & Login
- Full-screen cinematic split layout (visual left / form right)
- In-memory users with simulated JWT token (localStorage)
- Guards on protected routes
- User avatar (initials) in navbar

### 2. Navbar (Modern Luxury)
- Fixed, full-width with backdrop-filter: blur(20px)
- Turns solid with gold bottom border on scroll
- Links: Home · Recipes · Daily Menu · Prep List · Account
- Badge counter on Prep List link
- Mobile hamburger menu with premium animation

### 3. Prep List (Signature Feature — "Mise en Place")
- Create daily prep tasks derived from recipes
- Each task: ingredient, quantity, technique, estimated time, priority, status
- Integrated per-task timer (stopwatch)
- Visual progress bar (% of service prep complete)
- Archive completed prep lists

### 4. Daily Menu Builder
- Drag & drop (native HTML5) to assign recipes to: Starters / Mains / Desserts
- Guest count input ? auto-scales all ingredient quantities
- Auto-generates Shopping List from the day's menu

### 5. Recipe Scaler
- Portion input ? all ingredients auto-recalculate
- Smart unit conversion (g ? kg, ml ? L)

### 6. Tags & Seasons
- Season tags: Spring / Summer / Fall / Winter
- Type tags: Protein / Vegetable / Dessert / Sauce
- Allergen tags: Gluten / Dairy / Nuts / Shellfish
- Advanced filter + search

---

## Routes

```
/                     ? Home (hero landing)   ? public
/auth/login           ? Login                 ? public
/auth/register        ? Register              ? public
/recipes              ? My Collection         ? protected
/recipes/:id          ? Recipe Detail         ? protected
/menu                 ? Daily Menu Builder    ? protected
/prep-list            ? Prep List             ? protected
```

---

## Architecture

```
frontend/src/app/
+-- core/
¦   +-- models/          ? User, Recipe, PrepTask, MenuItem interfaces
¦   +-- services/        ? AuthService, RecipeService, PrepListService, MenuService
¦   +-- guards/          ? authGuard, publicGuard
¦   +-- interceptors/    ? authInterceptor (Bearer token)
+-- features/
¦   +-- auth/            ? LoginComponent, RegisterComponent
¦   +-- recipes/         ? RecipeListComponent, RecipeCardComponent, RecipeFormComponent
¦   +-- menu/            ? DailyMenuComponent (drag & drop)
¦   +-- prep-list/       ? PrepListComponent (timer, progress)
+-- shared/
    +-- navbar/          ? NavbarComponent (scroll-aware, auth-aware)
```

---

## Implementation Phases

### Phase 1 — Backend Auth (in-memory users)
- User model (in-memory store)
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me (with JWT middleware)
- Add Authorization header support to CORS

### Phase 2 — Frontend Auth
- User interface & AuthService (signals)
- authGuard and publicGuard
- LoginComponent (cinematic split layout)
- RegisterComponent
- authInterceptor for Bearer token
- Link recipes to logged-in user

### Phase 3 — Navbar
- NavbarComponent standalone
- Scroll-aware style (transparent ? solid)
- Auth-aware links (show/hide based on user)
- Mobile hamburger menu
- Badge on Prep List link

### Phase 4 — Prep List Feature
- PrepTask model (in-memory)
- Backend CRUD for prep tasks
- PrepListComponent with task cards
- Per-task stopwatch timer
- Progress bar

### Phase 5 — Daily Menu Builder
- MenuItem model
- Backend CRUD
- Drag & drop UI (native HTML5)
- Guest count ? auto-scale ingredients
- Shopping list generation

### Phase 6 — Recipe Enhancements
- Tags (season, type, allergens)
- Portion scaler
- Search + filter
