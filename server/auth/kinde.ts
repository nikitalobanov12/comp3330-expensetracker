import { Hono } from "hono";
import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { SessionManager } from "@kinde-oss/kinde-typescript-sdk";
import {
  createKindeServerClient,
  GrantType,
} from "@kinde-oss/kinde-typescript-sdk";

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Expected ${key} to be set in environment variables`);
  }
  return value;
};

export const kindeClient = createKindeServerClient(
  GrantType.AUTHORIZATION_CODE,
  {
    authDomain: requireEnv("KINDE_ISSUER_URL"),
    clientId: requireEnv("KINDE_CLIENT_ID"),
    clientSecret: requireEnv("KINDE_CLIENT_SECRET"),
    redirectURL: requireEnv("KINDE_REDIRECT_URI"),
    logoutRedirectURL: FRONTEND_URL,
  },
);

type HonoContext = Context;

// Minimal cookie-backed SessionManager implementation for Hono.
export function sessionFromHono(c: HonoContext): SessionManager {
  return {
    async getSessionItem(key: string) {
      return getCookie(c, key) ?? null;
    },
    async setSessionItem(key: string, value: unknown) {
      setCookie(c, key, String(value), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });
    },
    async removeSessionItem(key: string) {
      deleteCookie(c, key, { path: "/" });
    },
    async destroySession() {
      for (const name of [
        "access_token",
        "id_token",
        "refresh_token",
        "session",
      ]) {
        deleteCookie(c, name, { path: "/" });
      }
    },
  };
}

export const authRoute = new Hono()
  .get("/login", async (c) => {
    const session = sessionFromHono(c);
    const url = await kindeClient.login(session);
    return c.redirect(url.toString());
  })
  .get("/callback", async (c) => {
    const session = sessionFromHono(c);
    await kindeClient.handleRedirectToApp(session, new URL(c.req.url));
    return c.redirect(`${FRONTEND_URL}/expenses`);
  })
  .get("/logout", async (c) => {
    const session = sessionFromHono(c);
    await kindeClient.logout(session);
    return c.redirect(FRONTEND_URL);
  })
  .get("/me", async (c) => {
    const session = sessionFromHono(c);
    try {
      const profile = await kindeClient.getUserProfile(session);
      return c.json({ user: profile });
    } catch {
      return c.json({ user: null });
    }
  });
