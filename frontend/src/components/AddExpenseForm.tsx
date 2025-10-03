import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { api, expensesQueryKey, type ExpenseListResponse } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddExpenseForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();

  const amountNumber = amount === "" ? NaN : Number(amount);
  const amountIsValid = Number.isFinite(amountNumber) && amountNumber > 0;
  const titleIsValid = title.trim().length >= 3;

  const mutation = useMutation({
    mutationFn: (payload: { title: string; amount: number }) => api.createExpense(payload),
    onSuccess: (data) => {
      setTitle("");
      setAmount("");
      // Update cache optimistically before refetch to keep UI snappy.
      queryClient.setQueryData<ExpenseListResponse | undefined>(
        expensesQueryKey,
        (current) =>
          current
            ? {
                expenses: [...current.expenses, data.expense],
              }
            : current,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: expensesQueryKey });
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!titleIsValid || !amountIsValid) return;

    mutation.mutate({
      title: title.trim(),
      amount: Math.round(amountNumber),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <label className="flex-1 text-sm text-muted-foreground">
          <span className="mb-1 block font-medium text-foreground">Title</span>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Coffee and snacks"
            aria-invalid={!titleIsValid && title.length > 0}
            required
          />
        </label>
        <label className="w-full text-sm text-muted-foreground sm:w-48">
          <span className="mb-1 block font-medium text-foreground">Amount</span>
          <Input
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="12"
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            aria-invalid={!amountIsValid && amount.length > 0}
            required
          />
        </label>
        <Button
          type="submit"
          disabled={mutation.isPending || !titleIsValid || !amountIsValid}
          className="w-full sm:w-auto"
        >
          {mutation.isPending ? "Adding…" : "Add Expense"}
        </Button>
      </div>
      {mutation.isError ? (
        <p className="text-sm text-destructive">
          {(mutation.error instanceof Error && mutation.error.message) || "Failed to add expense"}
        </p>
      ) : null}
    </form>
  );
}
