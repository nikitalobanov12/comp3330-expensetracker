import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

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
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li
                key={i}
                className="flex animate-pulse items-center justify-between gap-4 rounded-lg border bg-muted/60 px-4 py-3"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-muted-foreground/20"></div>
                  <div className="h-3 w-1/4 rounded bg-muted-foreground/20"></div>
                </div>
                <div className="h-4 w-16 rounded bg-muted-foreground/20"></div>
              </li>
            ))}
          </ul>
        ) : null}

        {expensesQuery.isError ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">
              {(expensesQuery.error instanceof Error && expensesQuery.error.message) || "Failed to load expenses"}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => expensesQuery.refetch()}
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        ) : null}

        {!isLoading && items.length === 0 && !expensesQuery.isError ? (
          <div className="rounded-lg border border-dashed bg-muted/40 p-8 text-center">
            <h3 className="text-lg font-semibold">No expenses yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Start by adding your first expense using the form above.
            </p>
          </div>
        ) : null}

        {items.length > 0 ? (
          <ul className="space-y-2">
            {items.map((expense) => (
              <li
                key={expense.id}
                className="flex items-center justify-between gap-4 rounded-lg border bg-background/60 px-4 py-3 shadow-xs"
              >
                <div className="space-y-1">
                  <Link
                    to="/expenses/$id"
                    params={{ id: expense.id }}
                    className="font-medium leading-tight text-foreground underline-offset-4 hover:underline"
                  >
                    {expense.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">#{expense.id}</p>
                  {expense.fileUrl ? (
                    <a
                      href={expense.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                    >
                      Download receipt
                    </a>
                  ) : (
                    <p className="text-xs text-muted-foreground/80">Receipt not uploaded</p>
                  )}
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
