# Expense Tracker Frontend (Lab 8)

TanStack Router now powers multi-page navigation for the COMP3330 Expenses app, building on the TanStack Query
integration from Labs 6 and 7.

## Tech Stack

- React 19 + Vite + Bun
- Tailwind CSS v4 with ShadCN UI primitives
- TanStack Query for data fetching and mutations
- TanStack Router for layouts, nested routes, and navigation state

## Available Routes

- `/` — Landing page with Lab 8 highlights and quick links.
- `/expenses` — List view with optimistic deletes.
- `/expenses/:id` — Detail view that fetches a single expense on demand.
- `/expenses/new` — Form view that creates an expense and redirects back to the list.

## Local Development

```bash
bun install       # install dependencies
bun run dev       # start Vite dev server (frontend)
```

The backend still runs from the repository root with `bun dev`. When both servers are running, the Vite dev proxy
(forwarded in Lab 6) keeps API calls under `/api`.

## Testing & Linting

```bash
bun run lint
```

Linting covers both ESLint and TypeScript checks (via the generated config). Add Vitest suites for new features as they
arrive.
