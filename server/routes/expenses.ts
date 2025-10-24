// server/routes/expenses.ts
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Hono } from "hono";
import type { Context } from "hono";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db, schema } from "../db/client";
import { requireAuthMiddleware } from "../auth/requireAuth";
import { s3 } from "../lib/s3";

const { expenses } = schema;
const bucket = process.env.S3_BUCKET;
if (!bucket) {
  throw new Error("Expected S3_BUCKET to be configured");
}
type ExpenseRow = typeof expenses.$inferSelect;
type ExpenseInsert = typeof expenses.$inferInsert;

const titleSchema = z.string().min(3).max(100);
const amountSchema = z.number().int().positive();

export const expenseSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(100),
  amount: z.number().int().positive(),
  fileUrl: z.string().url().nullable(),
});

const updateExpenseSchema = z
  .object({
    title: titleSchema.optional(),
    amount: amountSchema.optional(),
    fileUrl: z.string().min(1).nullable().optional(),
    fileKey: z.string().min(1).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.amount !== undefined ||
      data.fileUrl !== undefined ||
      data.fileKey !== undefined,
    {
      message: "At least one field (title, amount, fileUrl, or fileKey) must be provided",
    },
  );

export const createExpenseSchema = z.object({
  title: titleSchema,
  amount: amountSchema,
  fileKey: z.string().min(1).optional(),
});

export type Expense = z.infer<typeof expenseSchema>;
type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;

const ok = <T>(c: Context, data: T, status = 200) => c.json({ data }, status);
const err = (c: Context, message: string, status = 400) =>
  c.json({ error: { message } }, status);

const buildUpdatePayload = (input: UpdateExpenseInput) => {
  const updates: Partial<ExpenseInsert> = {};
  if (input.title !== undefined) updates.title = input.title;
  if (input.amount !== undefined) updates.amount = input.amount;
  if (Object.prototype.hasOwnProperty.call(input, "fileKey")) {
    updates.fileUrl = input.fileKey ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(input, "fileUrl")) {
    updates.fileUrl = input.fileUrl ?? null;
  }
  return updates;
};

const withSignedDownloadUrl = async (row: ExpenseRow): Promise<ExpenseRow> => {
  if (!row.fileUrl) return row;
  if (row.fileUrl.startsWith("http://") || row.fileUrl.startsWith("https://")) {
    return row;
  }

  try {
    const signedUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: bucket,
        Key: row.fileUrl,
      }),
      { expiresIn: 3600 },
    );
    return { ...row, fileUrl: signedUrl };
  } catch (error) {
    console.error("Failed to sign download URL", error);
    return row;
  }
};

export const expensesRoute = new Hono()
  .use("*", requireAuthMiddleware)
  .get("/", async (c) => {
    const rows = await db.select().from(expenses);
    const expensesWithUrls = await Promise.all(rows.map(withSignedDownloadUrl));
    return ok(c, { expenses: expensesWithUrls });
  })
  .get("/:id{\\d+}", async (c) => {
    const id = Number(c.req.param("id"));
    const [row] = await db
      .select()
      .from(expenses)
      .where(eq(expenses.id, id))
      .limit(1);
    if (!row) return err(c, "Not found", 404);
    const expenseWithUrl = await withSignedDownloadUrl(row);
    return ok(c, { expense: expenseWithUrl });
  })
  .post("/", zValidator("json", createExpenseSchema), async (c) => {
    const input = c.req.valid("json");
    const { fileKey, ...rest } = input;
    const values: ExpenseInsert = {
      ...rest,
      fileUrl: fileKey ?? null,
    };
    const [created] = await db.insert(expenses).values(values).returning();
    const expenseWithUrl = await withSignedDownloadUrl(created);
    return ok(c, { expense: expenseWithUrl }, 201);
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
    const { fileKey, ...rest } = input;
    const updates: Partial<ExpenseInsert> = {
      ...rest,
    };
    if (Object.prototype.hasOwnProperty.call(input, "fileKey")) {
      updates.fileUrl = fileKey ?? null;
    }
    const [updated] = await db
      .update(expenses)
      .set(updates)
      .where(eq(expenses.id, id))
      .returning();
    if (!updated) return err(c, "Not found", 404);
    const expenseWithUrl = await withSignedDownloadUrl(updated);
    return ok(c, { expense: expenseWithUrl });
  },
);

expensesRoute.patch(
  "/:id{\\d+}",
  zValidator("json", updateExpenseSchema),
  async (c) => {
    const id = Number(c.req.param("id"));
    const raw = c.req.valid("json");
    const patch = buildUpdatePayload(raw);
    if (Object.keys(patch).length === 0) return err(c, "Empty patch", 400);

    const [updated] = await db
      .update(expenses)
      .set(patch)
      .where(eq(expenses.id, id))
      .returning();
    if (!updated) return err(c, "Not found", 404);
    const expenseWithUrl = await withSignedDownloadUrl(updated);
    return ok(c, { expense: expenseWithUrl });
  },
);
