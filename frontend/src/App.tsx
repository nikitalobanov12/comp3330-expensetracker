import { useState } from "react";

import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpensesList } from "@/components/ExpensesList";
import { AppCard } from "./components/AppCard";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshExpenses = () => setRefreshKey((value) => value + 1);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Expense Tracker</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Lab 6 — Vite proxy, typed fetch helper, and API-integrated UI.
              </p>
            </div>
            <ModeToggle />
          </div>
          <AddExpenseForm onAdded={refreshExpenses} />
          <ExpensesList refreshKey={refreshKey} />
          <AppCard />
        </div>
      </main>
    </ThemeProvider>
  );
}
