// server/routes/expenses.ts
import { Hono } from "hono";
import type { Context } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { db, schema } from "../db/client";
import { requireAuthMiddleware } from "../auth/requireAuth";

const { expenses } = schema;

export const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
});

const updateExpenseSchema = z
  .object({
    title: z.string().min(3).max(100).optional(),
    amount: z.number().int().positive().optional(),
  })
  .refine((data) => data.title !== undefined || data.amount !== undefined, {
    message: "At least one field (title or amount) must be provided",
  });

export const createExpenseSchema = expenseSchema.omit({ id: true });

export type Expense = z.infer<typeof expenseSchema>;

const ok = <T>(c: Context, data: T, status = 200) => c.json({ data }, status);
const err = (c: Context, message: string, status = 400) =>
  c.json({ error: { message } }, status);

const toPatchPayload = (input: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  );

export const expensesRoute = new Hono()
  .use("*", requireAuthMiddleware)
  .get("/", async (c) => {
    const rows = await db.select().from(expenses);
    return ok(c, { expenses: rows });
  })
  .get("/:id{\\d+}", async (c) => {
    const id = Number(c.req.param("id"));
    const [row] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id))
      .limit(1);
    if (!row) return err(c, "Not found", 404);
    return ok(c, { expense: row });
  })
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    const input = c.req.valid("json");
    const [created] = await db.insert(expenses).values(input).returning();
    return ok(c, { expense: created }, 201);
  })
  .delete("/:id{\\d+}", async (c) => {
    const id = Number(c.req.param("id"));
    const [removed] = await db
      .delete(expenses)
      .where(eq(expenses.id, id))
      .returning();
    if (!removed) return err(c, "Not found", 404);
    return ok(c, { deleted: removed });
  });

expensesRoute.put(
  "/:id{\\d+}",
  zValidator("json", createExpenseSchema),
  async (c) => {
    const id = Number(c.req.param("id"));
    const input = c.req.valid("json");
    const [updated] = await db
      .update(expenses)
      .set({ ...input })
      .where(eq(expenses.id, id))
      .returning();
    if (!updated) return err(c, "Not found", 404);
    return ok(c, { expense: updated });
  },
);

expensesRoute.patch(
  "/:id{\\d+}",
  zValidator("json", updateExpenseSchema),
  async (c) => {
    const id = Number(c.req.param("id"));
    const raw = c.req.valid("json");
    const patch = toPatchPayload(raw as Record<string, unknown>);
    if (Object.keys(patch).length === 0) return err(c, "Empty patch", 400);

    const [updated] = await db
      .update(expenses)
      .set(patch)
      .where(eq(expenses.id, id))
      .returning();
    if (!updated) return err(c, "Not found", 404);
    return ok(c, { expense: updated });
  },
);
