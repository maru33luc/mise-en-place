# frontend

Angular 22 app for mise-en-place — recipe management.

## Stack

- Angular 22 — standalone components, Signals, control flow
- TypeScript 6
- Vitest — unit testing
- ESLint + angular-eslint
- pnpm

## Structure

```
frontend/src/
├── app/
│   ├── app.ts / app.config.ts / app.routes.ts   # Shell + routing
│   ├── core/                                    # Singleton domain layer
│   │   ├── models/            # Recipe, Ingredient, Difficulty, ApiResponse
│   │   ├── services/          # RecipeService (HTTP), RecipesStore (state), ToastService
│   │   ├── interceptors/      # errorInterceptor
│   │   └── utils/             # validators
│   ├── features/recipes/      # Feature module (lazy-loaded)
│   │   ├── recipe-shell/      # Main shell (header, list, form, dialogs)
│   │   ├── recipe-list/       # Grid + loading + empty state
│   │   ├── recipe-card/       # Single recipe view
│   │   ├── recipe-form/       # Reusable create/edit form
│   │   ├── ingredient-input/  # Ingredient adder with tags
│   │   └── recipes.routes.ts
│   └── shared/                # Reusable presentational components
│       ├── alert/             # Global toast display
│       ├── loading/           # Spinner
│       ├── empty-state/       # Empty list placeholder
│       └── confirm-dialog/    # Accessible confirmation modal
└── environments/              # Dev/prod config
```

## Scripts

```bash
pnpm install          # Install dependencies
pnpm start            # Dev server → http://localhost:4200 (proxies /api → :3000)
pnpm run build        # Production build
pnpm test             # Unit tests (Vitest)
pnpm run lint         # ESLint
pnpm run format       # Format with Prettier
```

## Architecture decisions

- **State**: `RecipesStore` (Signals) is the single source of truth. Components read signals and call actions.
- **HTTP**: `RecipeService` is a pure HTTP layer; errors are handled globally by `errorInterceptor` + `ToastService`.
- **Validation**: Shared validators in `core/utils/validators.ts` used by all forms.
- **Accessibility**: Labels associated to inputs, `role="alert"` for toasts, `aria-label` for icon buttons, focus management in dialogs.
