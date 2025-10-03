# Agent Notes

## Context
- Lab 4 integrates Neon Postgres via Drizzle; in-memory array removed in `server/routes/expenses.ts`.
- Database client lives in `server/db/client.ts`; throws if `DATABASE_URL` missing to fail fast.
- Schema defined in `server/db/schema.ts` (expenses table: id serial, title varchar(100), amount int).
- Lab 6 adds a Vite dev proxy, typed REST helper in `frontend/src/lib/api.ts`, and an RPC endpoint under `/api/rpc` with matching client helper.

## Pending Setup
- `.env` currently holds a placeholder Neon HTTP connection string; replace with the real value before running migrations.
- Run `bun run db:push` (or `bun run db:generate`) after configuring `DATABASE_URL` to create tables.
- Populate `lab6-submission/screenshots/` with real captures and replace the placeholder `curl_list.txt`/`git_log.txt` before submitting Lab 6.

## Reminders
- Keep `ok`/`err` response helpers aligned across routes for consistent API shape.
- Update this file whenever DB schema, routes, or lab submission artefacts change.
