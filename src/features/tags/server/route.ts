import { Hono } from "hono";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { zValidator } from "@hono/zod-validator";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { quizTags as tagSchema } from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";
import {
  deleteTagSchema,
  insertTagSchema,
} from "@/features/tags/schema/zod-schema";

type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
};

const app = new Hono()
  /**
   * Get all quiz tags
   */
  .get("/", sessionMiddleware, async (c) => {
    try {
      const {
        page = "1",
        limit = "10",
        search = "",
      } = c.req.query() as QueryParams;

      // Get active organization
      const activeOrganizationId = c.get("session")?.activeOrganizationId;

      if (!activeOrganizationId) {
        return c.json(
          {
            error: "You must have an active organization to fetch quiz tags",
          },
          403
        );
      }

      // Convert to numbers and validate
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
      const offset = (pageNum - 1) * limitNum;

      // First, get the total count
      const countQuery = db
        .select({
          count: sql<number>`cast(count(*) as integer)`,
        })
        .from(tagSchema)
        .where(eq(tagSchema.organizationId, activeOrganizationId))
        .$dynamic();

      // Build the main query for items
      const itemsQuery = db
        .select()
        .from(tagSchema)
        .where(eq(tagSchema.organizationId, activeOrganizationId))
        .$dynamic();

      // Conditions array
      let conditions = [eq(tagSchema.organizationId, activeOrganizationId)];

      // Add search condition if search parameter exists
      if (search) {
        conditions.push(ilike(tagSchema.name, `%${search}%`));
      }

      // Apply all conditions together
      const whereCondition = and(...conditions);
      countQuery.where(whereCondition);
      itemsQuery.where(whereCondition);

      // Execute both queries
      const [countResult] = await countQuery;
      const items = await db
        .select()
        .from(tagSchema)
        .where(whereCondition)
        .limit(limitNum)
        .offset(offset)
        .orderBy(desc(tagSchema.createdAt));

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
      const error = err as Error;
      return c.json({ error: error.message }, 500);
    }
  })

  /**
   * Create new quiz tag
   */
  .post(
    "/",
    zValidator("json", insertTagSchema),
    sessionMiddleware,
    async (c) => {
      try {
        // Check user has permission to create quiz
        const hasPermission = await auth.api.hasPermission({
          headers: await headers(),
          body: {
            permission: {
              quizzes: ["create"],
            },
          },
        });

        if (hasPermission.error || !hasPermission.success) {
          return c.json(
            { error: "You don't have permission to create tags" },
            403
          );
        }

        const validFormData = c.req.valid("json");
        const activeOrganizationId = c.get("session")?.activeOrganizationId;
        const userId = c.get("session")?.userId;

        if (!activeOrganizationId) {
          return c.json(
            { error: "You must have an active organization to create quizzes" },
            403
          );
        }

        if (validFormData.organizationId !== activeOrganizationId) {
          return c.json({ error: "Please pass valid organization id" }, 403);
        }

        if (!userId) {
          return c.json(
            { error: "You must be logged in to create quizzes" },
            403
          );
        }

        // Create new quiz tag
        const now = new Date();
        const tag = await db
          .insert(tagSchema)
          .values({
            name: validFormData.name,
            organizationId: activeOrganizationId,
            createdAt: now,
          })
          .returning();

        return c.json({ data: tag[0] }, 201);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Delete tag by ID (DELETE: /:id)
   */
  .delete(
    "/:id",
    sessionMiddleware,
    zValidator("param", deleteTagSchema),
    async (c) => {
      try {
        const tag_id = parseInt(c.req.param("id"));

        if (!tag_id) {
          return c.json({ error: "Tag ID is required" }, 400);
        }

        // Check user has permission to delete lesson
        const { error: permissionErr, success: hasPermission } =
          await auth.api.hasPermission({
            headers: await headers(),
            body: {
              permission: {
                quizzes: ["delete"],
              },
            },
          });

        if (!hasPermission || permissionErr) {
          return c.json(
            { error: "You don't have permission to delete tags" },
            403
          );
        }

        // Delete lesson
        const deletedTag = await db
          .delete(tagSchema)
          .where(eq(tagSchema.id, tag_id));

        return c.json({ data: deletedTag }, 200);
      } catch (err) {
        const error = err as Error;

        c.json({ error: error.message }, 500);
      }
    }
  );

export default app;
