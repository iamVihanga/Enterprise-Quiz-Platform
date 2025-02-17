import { Hono } from "hono";
import { and, desc, ilike, sql } from "drizzle-orm";

import { db } from "@/db";
import { organization as organizationSchema } from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";

type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
};

const app = new Hono()
  /*
    Fetch Classes Route
  */
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");

    if (user?.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const {
      page = "1",
      limit = "10",
      search = "",
    } = c.req.query() as QueryParams;

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    // First, get the total count
    const countQuery = db
      .select({
        count: sql<number>`cast(count(*) as integer)`,
      })
      .from(organizationSchema)
      .$dynamic();

    // Build the main query for items
    const itemsQuery = db.select().from(organizationSchema).$dynamic();

    // Add search condition if search parameter exists
    if (search) {
      const searchCondition = and(
        ilike(organizationSchema.name, `%${search}%`)
      );
      countQuery.where(searchCondition);
      itemsQuery.where(searchCondition);
    }

    // Execute both queries
    const [countResult] = await countQuery;
    const items = await itemsQuery
      .limit(limitNum)
      .offset(offset)
      .orderBy(desc(organizationSchema.createdAt));

    const total = countResult.count;

    return c.json(
      {
        data: items,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      },
      200
    );
  });

export default app;
