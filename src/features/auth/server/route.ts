import { Hono } from "hono";
import { auth } from "@/lib/auth";

// Create a new Hono instance for auth routes
const authRoutes = new Hono().on(["POST", "GET"], "/**", (c) =>
  auth.handler(c.req.raw)
);

export default authRoutes;
