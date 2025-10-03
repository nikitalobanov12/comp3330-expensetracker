import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, expensesQueryKey, type ExpenseListResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DeleteContext = {
  snapshot: ExpenseListResponse | undefined;
  removedId: number;
};

export function ExpensesList() {
  const queryClient = useQueryClient();

  const expensesQuery = useQuery({
    queryKey: expensesQueryKey,
    queryFn: () => api.getExpenses(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteExpense(id),
    onMutate: async (id): Promise<DeleteContext> => {
      await queryClient.cancelQueries({ queryKey: expensesQueryKey });
      const snapshot = queryClient.getQueryData<ExpenseListResponse>(expensesQueryKey);

      queryClient.setQueryData<ExpenseListResponse | undefined>(expensesQueryKey, (current) =>
        current
          ? {
              expenses: current.expenses.filter((expense) => expense.id !== id),
            }
          : current,
      );

      return { snapshot, removedId: id };
    },
    onError: (_error, _id, context) => {
      if (context?.snapshot) {
        queryClient.setQueryData(expensesQueryKey, context.snapshot);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    },
  });

  const items = expensesQuery.data?.expenses ?? [];
  const isLoading = expensesQuery.isPending && !expensesQuery.data;
  const isRefreshing = expensesQuery.isFetching;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Expenses</CardTitle>
        <CardDescription>Cached and kept fresh with TanStack Query.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading expenses…</p>
        ) : null}

        {expensesQuery.isError ? (
          <p className="text-sm text-destructive">
            {(expensesQuery.error instanceof Error && expensesQuery.error.message) || "Failed to load expenses"}
          </p>
        ) : null}

        {!isLoading && items.length === 0 ? (
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
                    onClick={() => deleteMutation.mutate(expense.id)}
                    disabled={deleteMutation.isPending && deleteMutation.variables === expense.id}
                    aria-label={`Delete ${expense.title}`}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === expense.id ? "Removing…" : "Delete"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}

        {deleteMutation.isError ? (
          <p className="text-sm text-destructive">
            {(deleteMutation.error instanceof Error && deleteMutation.error.message) || "Failed to delete expense"}
          </p>
        ) : null}

        {isRefreshing && !isLoading ? (
          <p className="text-xs text-muted-foreground">Refreshing…</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
