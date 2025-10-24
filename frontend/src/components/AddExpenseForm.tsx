import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  api,
  expensesQueryKey,
  type ExpenseListResponse,
  type ExpenseResponse,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddExpenseFormProps = {
  onCreated?: (expense: ExpenseResponse["expense"]) => void;
};

export function AddExpenseForm({ onCreated }: AddExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();

  const amountNumber = amount === "" ? NaN : Number(amount);
  const amountIsValid = Number.isFinite(amountNumber) && amountNumber > 0;
  const titleIsValid = title.trim().length >= 3;

  const mutation = useMutation({
    mutationFn: (payload: { title: string; amount: number }) => api.createExpense(payload),
    onMutate: async (newItem) => {
      await queryClient.cancelQueries({ queryKey: expensesQueryKey });
      const previous = queryClient.getQueryData<ExpenseListResponse>(expensesQueryKey);

      if (previous) {
        const optimistic: ExpenseResponse["expense"] = {
          id: Date.now(),
          title: newItem.title,
          amount: newItem.amount,
          fileUrl: null,
        };
        queryClient.setQueryData<ExpenseListResponse>(expensesQueryKey, {
          expenses: [...previous.expenses, optimistic],
        });
      }

      return { previous };
    },
    onSuccess: (data) => {
      setTitle("");
      setAmount("");
      onCreated?.(data.expense);
    },
    onError: (_error, _newItem, context) => {
      if (context?.previous) {
        queryClient.setQueryData(expensesQueryKey, context.previous);
      }
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
          {title.length > 0 && !titleIsValid && (
            <p className="mt-1 text-xs text-destructive">Title must be at least 3 characters</p>
          )}
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
          {amount.length > 0 && !amountIsValid && (
            <p className="mt-1 text-xs text-destructive">Amount must be greater than 0</p>
          )}
        </label>
        <Button
          type="submit"
          disabled={mutation.isPending || !titleIsValid || !amountIsValid}
          className="w-full sm:w-auto"
        >
          {mutation.isPending ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Adding…
            </span>
          ) : (
            "Add Expense"
          )}
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
