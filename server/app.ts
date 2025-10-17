import { Hono } from "hono";
import { logger } from "hono/logger";
import { authRoute } from "./auth/kinde";
import { expensesRoute } from "./routes/expenses";
import rpcRoute from "./routes/rpc";
import { secureRoute } from "./routes/secure";

export const app = new Hono();

app.use("*", logger());

//hono middleware
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  // This is a response header that shows the response time of the request
  c.header("X-Response-Time", `${ms}ms`);
});

app.get("/", (c) => c.json({ message: "OK" }));
app.get("/health", (c) => c.json({ status: "healthy" }));
//Mount API Routes

app.route("/api/auth", authRoute);
app.route("/api/expenses", expensesRoute);
app.route("/api/secure", secureRoute);
app.route("/api/rpc", rpcRoute);
