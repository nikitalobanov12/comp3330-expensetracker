import { Hono } from "hono";
import { requireAuthMiddleware } from "../auth/requireAuth";

export const secureRoute = new Hono();

secureRoute.use("*", requireAuthMiddleware);

secureRoute.get("/profile", (c) => {
  const user = c.get("user");
  return c.json({ user });
});
