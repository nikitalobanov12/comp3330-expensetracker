# Agent Notes

## Context
- Lab 4 integrates Neon Postgres via Drizzle; in-memory array removed in `server/routes/expenses.ts`.
- Database client lives in `server/db/client.ts`; throws if `DATABASE_URL` missing to fail fast.
- Schema defined in `server/db/schema.ts` (expenses table: id serial, title varchar(100), amount int).
- Lab 6 adds a Vite dev proxy, typed REST helper in `frontend/src/lib/api.ts`, and an RPC endpoint under `/api/rpc` with matching client helper.
- Lab 7 wraps the React tree with `QueryClientProvider` and moves expense list/create/delete flows onto TanStack Query with optimistic cache updates.

## Pending Setup
- `.env` currently holds a placeholder Neon HTTP connection string; replace with the real value before running migrations.
- Run `bun run db:push` (or `bun run db:generate`) after configuring `DATABASE_URL` to create tables.
- Populate lab submission folders (Lab6/Lab7) with real captures and replace placeholder notes before handing in the respective labs.

## Reminders
- Keep `ok`/`err` response helpers aligned across routes for consistent API shape.
- Update this file whenever DB schema, routes, or lab submission artefacts change.
