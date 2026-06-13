# mise-en-place

A full-stack recipe management app built with Node.js and Angular. Dark, minimal UI inspired by New York fine dining.

## Stack

- **Frontend** — Angular 21, Signals, Vitest
- **Backend** — Node.js, Express, Zod

## Project Structure

```
mise-en-place/
├── frontend/   # Angular app
└── backend/    # Express API
```

## Getting Started

**Backend**
```bash
cd backend
npm install
npm start
# Running on http://localhost:3000
```

**Frontend**
```bash
cd frontend
npm install
ng serve
# Running on http://localhost:4200
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/recipes | Get all recipes |
| GET | /api/recipes/:id | Get recipe by ID |
| POST | /api/recipes | Create recipe |
| PUT | /api/recipes/:id | Update recipe |
| DELETE | /api/recipes/:id | Delete recipe |
| GET | /api/health | Health check |

### Recipe Schema

```json
{
  "title": "Pasta Carbonara",
  "description": "Classic Roman pasta dish",
  "difficulty": "medium",
  "ingredients": [
    { "name": "pasta", "amount": 400, "unit": "g" },
    { "name": "eggs", "amount": 3, "unit": "unit" }
  ]
}
```

**Validation rules:**
- `title` — 3 to 100 characters
- `description` — 5 to 500 characters
- `difficulty` — `easy` | `medium` | `hard`
- `ingredients` — at least 1 item, each with `name`, `amount`, and `unit`
