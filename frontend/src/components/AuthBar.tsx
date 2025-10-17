import * as React from "react";

type AuthenticatedUser = {
  email?: string | null;
  sub?: string | null;
};

export function AuthBar() {
  const [user, setUser] = React.useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => response.json())
      .then((data: { user: AuthenticatedUser | null }) => {
        if (!cancelled) {
          setUser(data.user);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <span className="text-xs text-muted-foreground">Checking session…</span>;
  }

  return (
    <div className="flex items-center gap-3 text-sm">
      {user ? (
        <>
          <span className="text-muted-foreground">{user.email ?? user.sub}</span>
          <a
            className="rounded bg-primary px-3 py-1 text-primary-foreground"
            href="/api/auth/logout"
          >
            Logout
          </a>
        </>
      ) : (
        <a className="rounded bg-primary px-3 py-1 text-primary-foreground" href="/api/auth/login">
          Login
        </a>
      )}
    </div>
  );
}
