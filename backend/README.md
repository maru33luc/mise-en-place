# backend

Express REST API for mise-en-place.

## Stack

- Node.js + Express
- Zod — schema validation

## Structure

```
backend/
├── controllers/   # Route handlers
├── middleware/    # Validation middleware
├── models/        # Data layer
├── routes/        # Route definitions
├── schemas/       # Zod schemas
└── server.js      # Entry point
```

## Scripts

```bash
npm start   # Start server
```

Runs on `http://localhost:3000`.
