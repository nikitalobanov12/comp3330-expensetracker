import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, expensesQueryKey } from "@/lib/api";

export default function ExpenseDetailRoute() {
  const { id } = useParams({ from: "/expenses/$id" });
  const expenseId = typeof id === "number" ? id : Number(id);
  const isValidId = Number.isFinite(expenseId);

  const expenseQuery = useQuery({
    queryKey: [...expensesQueryKey, expenseId],
    queryFn: () => api.getExpense(expenseId),
    enabled: isValidId,
  });

  if (!isValidId) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">Invalid expense id.</p>
        <Button variant="secondary" asChild>
          <Link to="/expenses">Back to list</Link>
        </Button>
      </div>
    );
  }

  if (expenseQuery.isPending) {
    return (
      <p className="text-sm text-muted-foreground">Loading expense #{expenseId}…</p>
    );
  }

  if (expenseQuery.isError) {
    const message =
      expenseQuery.error instanceof Error ? expenseQuery.error.message : "Failed to load expense";
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">{message}</p>
        <Button variant="secondary" asChild>
          <Link to="/expenses">Back to list</Link>
        </Button>
      </div>
    );
  }

  const expense = expenseQuery.data?.expense;

  if (!expense) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Expense not found.</p>
        <Button variant="secondary" asChild>
          <Link to="/expenses">Back to list</Link>
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">{expense.title}</CardTitle>
        <CardDescription>Expense details pulled on demand</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Expense ID</p>
          <p className="font-mono text-lg">#{expense.id}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Amount</p>
          <p className="text-2xl font-semibold tabular-nums">${expense.amount}</p>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button variant="secondary" asChild>
          <Link to="/expenses">Back to list</Link>
        </Button>
        <Button asChild>
          <Link to="/expenses/new">Add another expense</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
