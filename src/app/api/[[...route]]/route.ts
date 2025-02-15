import { Hono } from "hono";
import { handle } from "hono/vercel";

import { auth } from "@/lib/auth";
import authRoutes from "@/features/auth/server/route";

const app = new Hono().basePath("/api");

// Define Routes
const routes = app
  // Auth Routes
  .route("/auth", authRoutes)

  // Test Routes
  .get("/hello", (c) => {
    return c.json({ hello: "World" });
  });

// RPC App Type
export type AppType = typeof routes;

// Export handlers
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
