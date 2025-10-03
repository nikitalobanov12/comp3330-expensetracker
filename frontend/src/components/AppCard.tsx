import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export function AppCard() {
  return (
    <Card className="mt-6 font-mono">
      <CardHeader>
        <CardTitle>Lab 6 Checkpoints</CardTitle>
        <CardDescription>
          Vite proxy wired up • Fetch helper shared • UI consuming live API data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Use the Add Expense form to POST through the proxy.</li>
          <li>List updates instantly thanks to the typed fetch helper.</li>
          <li>Try deleting an item to confirm optimistic UI updates.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
