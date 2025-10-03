import { AppCard } from "./components/AppCard";
import { ModeToggle } from "./components/mode-toggle";
import { ThemeProvider } from "./components/theme-provider";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-3xl p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">COMP3330 – Frontend Setup</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Vite • React • Tailwind • ShadCN
              </p>
            </div>
            <ModeToggle />
          </div>
          <AppCard />
        </div>
      </main>
    </ThemeProvider>
  );
}
