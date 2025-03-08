import { Hono } from "hono";
import { handle } from "hono/vercel";

import authRoutes from "@/features/auth/server/route";
import classesRoutes from "@/features/classes/server/route";
import studentsRoutes from "@/features/students/server/route";
import adminsRoutes from "@/features/admins/server/route";
import userRoutes from "@/features/users/server/route";
import lessonsRoutes from "@/features/lessons/server/route";
import materialsRoutes from "@/features/materials/server/route";

const app = new Hono().basePath("/api");

// Define Routes
const routes = app
  // Auth Routes
  .route("/auth", authRoutes)

  // Class Management Routes
  .route("/classes", classesRoutes)
  .route("/students", studentsRoutes)
  .route("/admins", adminsRoutes)

  // Content Management Routes
  .route("/lessons", lessonsRoutes)
  .route("/materials", materialsRoutes)

  // Admin Settings Routes
  .route("/users", userRoutes);

// RPC App Type
export type AppType = typeof routes;

// Export handlers
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
