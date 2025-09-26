# Agent Notes

## Context
- Lab 4 integrates Neon Postgres via Drizzle; in-memory array removed in `server/routes/expenses.ts`.
- Database client lives in `server/db/client.ts`; throws if `DATABASE_URL` missing to fail fast.
- Schema defined in `server/db/schema.ts` (expenses table: id serial, title varchar(100), amount int).

## Pending Setup
- `.env` currently holds a placeholder Neon HTTP connection string; replace with the real value before running migrations.
- Run `bun run db:push` (or `bun run db:generate`) after configuring `DATABASE_URL` to create tables.
- Capture curl screenshots for Lab 4 submission once API verified against Neon.

## Reminders
- Keep `ok`/`err` response helpers aligned across routes for consistent API shape.
- Update this file whenever DB schema, routes, or lab submission artefacts change.
