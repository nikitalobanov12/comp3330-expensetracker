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
        <CardTitle>Lab 7 Checkpoints</CardTitle>
        <CardDescription>
          TanStack Query caches reads, powers optimistic writes, and keeps the proxy-driven API in sync.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>`useQuery` hydrates the list with loading/error fallbacks.</li>
          <li>`useMutation` invalidates and patches the cache on create/delete.</li>
          <li>React Query Devtools ready—just import when debugging.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
