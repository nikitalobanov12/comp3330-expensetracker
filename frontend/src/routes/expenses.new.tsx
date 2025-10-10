import { Link, useRouter } from "@tanstack/react-router";

import { AddExpenseForm } from "@/components/AddExpenseForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExpenseNewRoute() {
  const router = useRouter();

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">New Expense</CardTitle>
        <CardDescription>Submit a title and amount to add another item to your ledger.</CardDescription>
      </CardHeader>
      <CardContent>
        <AddExpenseForm onCreated={() => router.navigate({ to: "/expenses" })} />
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <Button variant="secondary" asChild>
          <Link to="/expenses">Cancel</Link>
        </Button>
        <span>Submissions redirect to the expenses list automatically.</span>
      </CardFooter>
    </Card>
  );
}
