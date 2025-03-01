import { Hono } from "hono";
import { and, desc, eq, ilike, sql, inArray } from "drizzle-orm";

import { db } from "@/db";
import {
  organization as organizationSchema,
  member as memberSchema,
} from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";

type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
};

const app = new Hono()
  /*
    Fetch Organizations Route
  */
  .get("/", sessionMiddleware, async (c) => {
    try {
      const user = c.get("user");

      // This filters system admin role
      const isAdmin = user?.role === "admin";

      const {
        page = "1",
        limit = "10",
        search = "",
      } = c.req.query() as QueryParams;

      // Convert to numbers and validate
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
      const offset = (pageNum - 1) * limitNum;

      // For non-admin users, get the organizations they're enrolled in
      let userOrganizationIds: string[] = [];

      if (!isAdmin && user) {
        // Get the organizations where the user is a member
        const userMemberships = await db
          .select({ organizationId: memberSchema.organizationId })
          .from(memberSchema)
          .where(eq(memberSchema.userId, user.id));

        userOrganizationIds = userMemberships.map((m) => m.organizationId);

        // If user has no organizations, return empty result early
        if (userOrganizationIds.length === 0) {
          return c.json(
            {
              data: [],
              pagination: {
                total: 0,
                page: pageNum,
                limit: limitNum,
                totalPages: 0,
              },
            },
            200
          );
        }
      }

      // First, get the total count
      const countQuery = db
        .select({
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(organizationSchema)
        .$dynamic();

      // Build the main query for items
      const itemsQuery = db.select().from(organizationSchema).$dynamic();

      // Add role condition based on isAdmin (system admin)
      if (!isAdmin && userOrganizationIds.length > 0) {
        const membershipCondition = inArray(
          organizationSchema.id,
          userOrganizationIds
        );
        countQuery.where(membershipCondition);
        itemsQuery.where(membershipCondition);
      }

      // Add search condition if search parameter exists
      if (search) {
        const searchCondition = ilike(organizationSchema.name, `%${search}%`);

        if (!isAdmin && userOrganizationIds.length > 0) {
          // If already has membership condition, need to use 'and'
          countQuery.where(searchCondition);
          itemsQuery.where(searchCondition);
        } else {
          countQuery.where(searchCondition);
          itemsQuery.where(searchCondition);
        }
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
    } catch (err) {
      const error =
        err instanceof Error ? err.message : "Failed to fetch organizations";
      return c.json({ error }, 500);
    }
  });

export default app;
