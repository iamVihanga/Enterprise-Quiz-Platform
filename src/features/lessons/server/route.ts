import { Hono } from "hono";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { lessons as lessonsSchema } from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";
import { auth } from "@/lib/auth";
import {
  addLessonSchema,
  deleteLessonSchema,
} from "@/features/lessons/schemas/zod-lesson-schema";

type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
};

const app = new Hono()
  /**
   * Fetch all lessons
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
          { error: "You must have an active organization to fetch lessons" },
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
        .from(lessonsSchema)
        .where(eq(lessonsSchema.organizationId, activeOrganizationId))
        .$dynamic();

      // Build the main query for items
      const itemsQuery = db
        .select()
        .from(lessonsSchema)
        .where(eq(lessonsSchema.organizationId, activeOrganizationId))
        .$dynamic();

      // Add search condition if search parameter exists
      if (search) {
        const searchCondition = and(ilike(lessonsSchema.name, `%${search}%`));
        countQuery.where(searchCondition);
        itemsQuery.where(searchCondition);
      }

      // Execute both queries
      const [countResult] = await countQuery;
      const items = await itemsQuery
        .limit(limitNum)
        .offset(offset)
        .orderBy(desc(lessonsSchema.createdAt));

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
   * Create new lesson
   */
  .post(
    "/",
    zValidator("form", addLessonSchema),
    sessionMiddleware,
    async (c) => {
      // Check user has permission to create lesson
      const hasPermission = await auth.api.hasPermission({
        headers: await headers(),
        body: {
          permission: {
            lesson: ["create"],
          },
        },
      });

      if (hasPermission.error || !hasPermission.success) {
        return c.json(
          { error: "You don't have permission to create lessons" },
          403
        );
      }

      const validformData = c.req.valid("form");

      const activeOrganizationId = c.get("session")?.activeOrganizationId;

      if (!activeOrganizationId) {
        return c.json(
          { error: "You must have an active organization to create lessons" },
          403
        );
      }

      // Create new lesson with server-managed fields
      const now = new Date();
      const lesson = await db.insert(lessonsSchema).values({
        ...validformData,
        organizationId: activeOrganizationId,
        createdAt: now,
        updatedAt: now,
      });

      return c.json({ data: lesson }, 200);
    }
  )

  /**
   * Delete lesson
   */
  .delete(
    "/:id",
    sessionMiddleware,
    zValidator("param", deleteLessonSchema),
    async (c) => {
      try {
        const lesson_id = parseInt(c.req.param("id"));

        if (!lesson_id) {
          return c.json({ error: "Lesson ID is required" }, 400);
        }

        // Check user has permission to delete lesson
        const { error: permissionErr, success: hasPermission } =
          await auth.api.hasPermission({
            headers: await headers(),
            body: {
              permission: {
                lesson: ["delete"],
              },
            },
          });

        if (!hasPermission || permissionErr) {
          return c.json(
            { error: "You don't have permission to delete lessons" },
            403
          );
        }

        // Delete lesson
        const deletedLesson = await db
          .delete(lessonsSchema)
          .where(eq(lessonsSchema.id, lesson_id));

        return c.json({ data: deletedLesson }, 200);
      } catch (err) {
        const error = err as Error;

        c.json({ error: error.message }, 500);
      }
    }
  );

export default app;
