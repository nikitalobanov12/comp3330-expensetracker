import { Link } from "@tanstack/react-router";

import { ExpensesList } from "@/components/ExpensesList";
import { Button } from "@/components/ui/button";

export default function ExpensesListRoute() {
  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Recent Expenses</h2>
          <p className="text-sm text-muted-foreground">
            Browse expenses fetched through TanStack Query with optimistic deletion.
          </p>
        </div>
        <Button asChild>
          <Link to="/expenses/new">Add Expense</Link>
        </Button>
      </header>

      <ExpensesList />
    </section>
  );
}
