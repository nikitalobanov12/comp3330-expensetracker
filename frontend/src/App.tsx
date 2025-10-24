import { Link, Outlet } from "@tanstack/react-router";

import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";
import { AuthBar } from "./components/AuthBar";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 p-6">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Expense Tracker</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Lab 10 — Secure file uploads with signed URLs and private receipts.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <nav className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Link
                  to="/"
                  className="transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:font-medium data-[status=active]:underline"
                >
                  Home
                </Link>
                <Link
                  to="/expenses"
                  className="transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:font-medium data-[status=active]:underline"
                >
                  Expenses
                </Link>
                <Link
                  to="/expenses/new"
                  className="transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:font-medium data-[status=active]:underline"
                >
                  New Expense
                </Link>
              </nav>
              <AuthBar />
              <ModeToggle />
            </div>
          </header>

          <section className="flex-1">
            <Outlet />
          </section>
        </div>
      </main>
    </ThemeProvider>
  );
}
