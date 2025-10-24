export type HttpError = { status: number; message: string };

async function request<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const finalInit: RequestInit = {
    credentials: "include",
    ...init,
  };

  const res = await fetch(input, finalInit);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw { status: res.status, message: text || res.statusText } satisfies HttpError;
  }

  if (res.status === 204) {
    return undefined as unknown as T;
  }

  const body = (await res.json()) as unknown;
  if (isRecordWithData(body)) {
    return body.data as T;
  }

  return body as T;
}

const json = (body: unknown): Pick<RequestInit, "headers" | "body"> => ({
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

function isRecordWithData(value: unknown): value is { data: unknown } {
  return Boolean(value && typeof value === "object" && "data" in value);
}

type Expense = {
  id: number;
  title: string;
  amount: number;
  fileUrl: string | null;
};

type ExpenseListResponse = { expenses: Expense[] };
type ExpenseResponse = { expense: Expense };
type ExpenseDeletedResponse = { deleted: Expense };

export const api = {
  getExpenses: () => request<ExpenseListResponse>("/api/expenses"),
  getExpense: (id: number) => request<ExpenseResponse>(`/api/expenses/${id}`),
  createExpense: (payload: { title: string; amount: number; fileKey?: string }) =>
    request<ExpenseResponse>("/api/expenses", {
      method: "POST",
      ...json(payload),
    }),
  updateExpense: (
    id: number,
    payload: {
      title?: string;
      amount?: number;
      fileKey?: string | null;
      fileUrl?: string | null;
    },
  ) =>
    request<ExpenseResponse>(`/api/expenses/${id}`, {
      method: "PATCH",
      ...json(payload),
    }),
  deleteExpense: (id: number) =>
    request<ExpenseDeletedResponse>(`/api/expenses/${id}`, { method: "DELETE" }),
  signUpload: (payload: { filename: string; type: string }) =>
    request<{ uploadUrl: string; key: string }>("/api/upload/sign", {
      method: "POST",
      ...json(payload),
    }),
};

export const expensesQueryKey = ["expenses"] as const;

export type { Expense, ExpenseListResponse, ExpenseResponse };
