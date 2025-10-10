import { Outlet } from "@tanstack/react-router";

export default function ExpensesLayout() {
  return (
    <div className="space-y-6">
      <Outlet />
    </div>
  );
}
