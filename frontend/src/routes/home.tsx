import { Link } from "@tanstack/react-router";

import { AppCard } from "@/components/AppCard";
import { Button } from "@/components/ui/button";

export default function HomeRoute() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border bg-card/60 p-8 shadow-sm">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">Welcome to Lab 8</h2>
          <p className="text-sm text-muted-foreground">
            The app now uses TanStack Router for multi-page navigation while keeping the TanStack Query data
            layer you integrated in Labs 6 and 7. Jump into the Expenses section to browse, inspect, and add
            transactions.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/expenses">View Expenses</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link to="/expenses/new">Add Expense</Link>
            </Button>
          </div>
        </div>
      </section>

      <AppCard />
    </div>
  );
}
