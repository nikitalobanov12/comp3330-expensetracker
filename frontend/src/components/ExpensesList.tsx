import { useEffect, useState } from "react";

import { api, type Expense } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ExpensesListProps = {
  refreshKey: number;
};

type Status = "idle" | "loading" | "ready" | "error";

export function ExpensesList({ refreshKey }: ExpensesListProps) {
  const [items, setItems] = useState<Expense[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadExpenses() {
      setStatus("loading");
      setError(null);
      try {
        const data = await api.getExpenses();
        if (!cancelled) {
          setItems(data.expenses);
          setStatus("ready");
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load expenses";
          setError(message || "Failed to load expenses");
          setStatus("error");
        }
      }
    }

    loadExpenses();

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleDelete(id: number) {
    setDeletingId(id);
    setError(null);
    try {
      await api.deleteExpense(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete expense";
      setError(message || "Failed to delete expense");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Expenses</CardTitle>
        <CardDescription>Fetched directly from the API via the Vite proxy.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "loading" ? (
          <p className="text-sm text-muted-foreground">Loading expenses…</p>
        ) : null}

        {status === "error" && error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        {status === "ready" && items.length === 0 ? (
          <div className="rounded-lg border border-dashed bg-muted/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">No expenses yet. Add your first entry above.</p>
          </div>
        ) : null}

        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between gap-4 rounded-lg border bg-background/60 px-4 py-3 shadow-xs"
              >
                <div>
                  <p className="font-medium leading-tight">{expense.title}</p>
                  <p className="text-sm text-muted-foreground">#{expense.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold tabular-nums">${expense.amount}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(expense.id)}
                    disabled={deletingId === expense.id}
                    aria-label={`Delete ${expense.title}`}
                  >
                    {deletingId === expense.id ? "Removing…" : "Delete"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
