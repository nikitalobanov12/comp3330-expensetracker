import type { Context, MiddlewareHandler } from "hono";
import { kindeClient, sessionFromHono } from "./kinde";

export async function requireAuth(c: Context) {
  const session = sessionFromHono(c);
  const authenticated = await kindeClient.isAuthenticated(session);
  if (!authenticated) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const user = await kindeClient.getUserProfile(session);
  c.set("user", user);
  return null;
}

export const requireAuthMiddleware: MiddlewareHandler = async (c, next) => {
  const err = await requireAuth(c);
  if (err) return err;
  await next();
};
