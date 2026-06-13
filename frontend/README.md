# frontend

Angular app for mise-en-place.

## Stack

- Angular 21 — standalone components, Signals
- Vitest — unit testing

## Structure

```
frontend/src/app/
├── app.ts        # Component logic
├── app.html      # Template
├── app.css       # Styles
├── app.spec.ts   # Tests
└── recipe.service.ts
```

## Scripts

```bash
ng serve    # Dev server → http://localhost:4200
ng build    # Production build
ng test     # Run unit tests
```
