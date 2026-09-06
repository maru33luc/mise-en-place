# Frontend

Angular 22 client for Mise en Place. It uses standalone components, Signals, strict TypeScript, native HTML5 drag and drop, and Vitest.

## Commands

```bash
pnpm install
pnpm start
pnpm build
pnpm test
pnpm lint
```

The development server runs on `http://localhost:4200` and calls the API configured in `src/environments/environment.ts`.

## Routes

- `/` public landing page.
- `/auth/login` and `/auth/register` public authentication screens.
- `/recipes` protected recipe collection.
- `/recipes/:id` protected recipe detail and portion view.
- `/menu` protected daily menu builder and shopping list.
- `/prep-list` protected preparation tasks and timers.

## Structure

- `core`: models, HTTP services, auth guards and interceptors.
- `features`: home, auth, recipes, menu and prep list workflows.
- `shared`: navbar and reusable feedback/presentation components.

The app stores the simulated JWT and user profile in local storage and sends the token through the auth interceptor.
