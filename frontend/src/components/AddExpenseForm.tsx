import { useState } from "react";

import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type AddExpenseFormProps = {
  onAdded?: () => void;
};

export function AddExpenseForm({ onAdded }: AddExpenseFormProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amountNumber = amount === "" ? NaN : Number(amount);
  const amountIsValid = Number.isFinite(amountNumber) && amountNumber > 0;
  const titleIsValid = title.trim().length >= 3;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!titleIsValid || !amountIsValid) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.createExpense({
        title: title.trim(),
        amount: Math.round(amountNumber),
      });
      setTitle("");
      setAmount("");
      onAdded?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add expense";
      setError(message || "Failed to add expense");
    } finally {
      setSubmitting(false);
    }
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
          disabled={submitting || !titleIsValid || !amountIsValid}
          className="w-full sm:w-auto"
        >
          {submitting ? "Adding…" : "Add Expense"}
        </Button>
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
