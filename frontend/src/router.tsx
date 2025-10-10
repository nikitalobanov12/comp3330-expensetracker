import { Link, RouterProvider, createRootRoute, createRoute, createRouter } from "@tanstack/react-router";

import App from "./App";
import { Button } from "@/components/ui/button";
import HomeRoute from "@/routes/home";
import ExpenseDetailRoute from "@/routes/expenses.detail";
import ExpensesLayout from "@/routes/expenses.layout";
import ExpensesListRoute from "@/routes/expenses.list";
import ExpensesNewRoute from "@/routes/expenses.new";

const rootRoute = createRootRoute({
  component: App,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomeRoute,
});

const expensesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "expenses",
  component: ExpensesLayout,
});

const expensesListRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: "/",
  component: ExpensesListRoute,
});

const expensesDetailRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: "$id",
  parseParams: (params) => ({ id: Number(params.id) }),
  stringifyParams: ({ id }) => ({ id: String(id) }),
  component: ExpenseDetailRoute,
});

const expensesNewRoute = createRoute({
  getParentRoute: () => expensesRoute,
  path: "new",
  component: ExpensesNewRoute,
});

expensesRoute.addChildren([expensesListRoute, expensesDetailRoute, expensesNewRoute]);

const routeTree = rootRoute.addChildren([indexRoute, expensesRoute]);

// eslint-disable-next-line react-refresh/only-export-components
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultNotFoundComponent: () => (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Page not found</h2>
      <p className="text-sm text-muted-foreground">
        The page you are looking for does not exist. Try heading back to the dashboard.
      </p>
      <Button asChild>
        <Link to="/">Return home</Link>
      </Button>
    </div>
  ),
  defaultErrorComponent: ({ error }) => (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="text-sm text-destructive">
        {(error instanceof Error && error.message) || "Unexpected error"}
      </p>
      <Button asChild variant="secondary">
        <Link to="/">Reload the app</Link>
      </Button>
    </div>
  ),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function AppRouter() {
  return <RouterProvider router={router} />;
}
