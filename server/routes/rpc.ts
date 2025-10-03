import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";

import { db, schema } from "../db/client";
import { createExpenseSchema, expenseSchema } from "./expenses";

const deleteExpenseSchema = z.object({
  id: expenseSchema.shape.id,
});

const payloadSchema = z.object({
  method: z.enum(["listExpenses", "createExpense", "deleteExpense"]),
  params: z.unknown().optional(),
});

const rpcRoute = new Hono();

rpcRoute.post("/", zValidator("json", payloadSchema), async (c) => {
  const { method, params } = c.req.valid("json");

  switch (method) {
    case "listExpenses": {
      const rows = await db.select().from(schema.expenses);
      return c.json({ data: { expenses: rows } });
    }
    case "createExpense": {
      const input = createExpenseSchema.parse(params);
      const [created] = await db.insert(schema.expenses).values(input).returning();
      return c.json({ data: { expense: created } }, 201);
    }
    case "deleteExpense": {
      const { id } = deleteExpenseSchema.parse(params);
      const [removed] = await db
        .delete(schema.expenses)
        .where(eq(schema.expenses.id, id))
        .returning();
      if (!removed) {
        return c.json({ error: { message: "Not found" } }, 404);
      }
      return c.json({ data: { deleted: removed } });
    }
    default:
      return c.json({ error: { message: "Unknown method" } }, 400);
  }
});

export default rpcRoute;
