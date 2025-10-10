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
        <CardTitle>Lab 8 Highlights</CardTitle>
        <CardDescription>
          File-based TanStack Router complements the TanStack Query data layer from earlier labs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <code>Link</code> components wire the navbar and list items to nested routes.
          </li>
          <li>Layouts keep the theme toggle and copy consistent across every page.</li>
          <li>Queries stay in sync as you navigate between list, detail, and form views.</li>
        </ul>
      </CardContent>
    </Card>
  );
}
