import { Hono } from "hono";

import { db } from "@/db";
import { user as userSchema } from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";
import { eq } from "drizzle-orm";

const app = new Hono().get("/:id", sessionMiddleware, async (c) => {
  const sessionUser = c.get("user");

  if (!sessionUser || sessionUser?.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const userId = c.req.param("id");

  if (!userId) {
    return c.json({ error: "No userId found" }, 500);
  }

  const user = await db
    .select()
    .from(userSchema)
    .where(eq(userSchema.id, userId));

  if (user.length === 0) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json({ data: user[0] }, 200);
});

export default app;
