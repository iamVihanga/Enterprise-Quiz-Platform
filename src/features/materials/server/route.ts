import { Hono } from "hono";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import { materialsTable as materialSchema } from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";
import { auth } from "@/lib/auth";
import {
  addMaterialSchema,
  deleteMaterialSchema,
  findByIdMaterialSchema,
} from "@/features/materials/schemas/zod-material-schema";

type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
  lessonId?: string;
};

const app = new Hono()
  /**
   * Fetch all lessons  (GET: /)
   */
  .get("/", sessionMiddleware, async (c) => {
    try {
      const {
        page = "1",
        limit = "10",
        search = "",
        lessonId = "",
      } = c.req.query() as QueryParams;

      const activeLessonId =
        typeof lessonId !== "number" ? parseInt(lessonId) : lessonId;

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
        .from(materialSchema)
        .where(eq(materialSchema.lessonId, activeLessonId))
        .$dynamic();

      // Build the main query for items
      const itemsQuery = db
        .select()
        .from(materialSchema)
        .where(eq(materialSchema.lessonId, activeLessonId))
        .$dynamic();

      // Add search condition if search parameter exists
      if (search) {
        const searchCondition = and(
          ilike(materialSchema.name, `%${search}%`),
          eq(materialSchema.lessonId, activeLessonId)
        );

        countQuery.where(searchCondition);
        itemsQuery.where(searchCondition);
      }

      // Execute both queries
      const [countResult] = await countQuery;
      const items = await itemsQuery
        .limit(limitNum)
        .offset(offset)
        .orderBy(desc(materialSchema.createdAt));

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
   * Fetch material by ID (GET: /:id)
   */
  .get(
    "/:id",
    sessionMiddleware,
    zValidator("param", findByIdMaterialSchema),
    async (c) => {
      try {
        // Validate material id
        const material_id = parseInt(c.req.param("id"));

        if (!material_id) {
          return c.json({ error: "Material ID is required" }, 400);
        }

        // Get active organization
        const activeOrganizationId = c.get("session")?.activeOrganizationId;

        if (!activeOrganizationId) {
          return c.json(
            {
              error: "You must have an active organization to fetch materials",
            },
            403
          );
        }

        // Fetch lesson by ID
        const itemsQuery = db
          .select()
          .from(materialSchema)
          .where(eq(materialSchema.id, material_id))
          .$dynamic();

        const material = await itemsQuery;

        return c.json({ data: material }, 200);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Create new lesson (POST: /)
   */
  .post(
    "/",
    zValidator("form", addMaterialSchema),
    sessionMiddleware,
    async (c) => {
      // Check user has permission to create material
      const hasPermission = await auth.api.hasPermission({
        headers: await headers(),
        body: {
          permission: {
            materials: ["create"],
          },
        },
      });

      if (hasPermission.error || !hasPermission.success) {
        return c.json(
          { error: "You don't have permission to create materials" },
          403
        );
      }

      const validformData = c.req.valid("form");

      const activeOrganizationId = c.get("session")?.activeOrganizationId;

      if (!activeOrganizationId) {
        return c.json(
          { error: "You must have an active organization to create materials" },
          403
        );
      }

      // Create new material with server-managed fields
      const now = new Date();
      const material = await db.insert(materialSchema).values({
        ...validformData,
        lessonId: parseInt(validformData.lessonId),
        createdAt: now,
        updatedAt: now,
      });

      return c.json({ data: material }, 200);
    }
  )

  /**
   * Update material by ID (PUT: /:id)
   */
  .put(
    "/:id",
    zValidator("form", addMaterialSchema),
    sessionMiddleware,
    async (c) => {
      const material_id = parseInt(c.req.param("id"));

      if (!material_id) {
        return c.json({ error: "Material ID is required" }, 400);
      }

      // Check user has permission to create lesson
      const hasPermission = await auth.api.hasPermission({
        headers: await headers(),
        body: {
          permission: {
            materials: ["update"],
          },
        },
      });

      if (hasPermission.error || !hasPermission.success) {
        return c.json(
          { error: "You don't have permission to update lessons" },
          403
        );
      }

      const validformData = c.req.valid("form");

      // Create new material with server-managed fields
      const now = new Date();

      const material = await db
        .update(materialSchema)
        .set({
          ...validformData,
          lessonId: parseInt(validformData.lessonId),
          updatedAt: now,
        })
        .where(eq(materialSchema.id, material_id));

      return c.json({ data: material }, 200);
    }
  )

  /**
   * Delete material by ID (DELETE: /:id)
   */
  .delete(
    "/:id",
    sessionMiddleware,
    zValidator("param", deleteMaterialSchema),
    async (c) => {
      try {
        const material_id = parseInt(c.req.param("id"));

        if (!material_id) {
          return c.json({ error: "Material ID is required" }, 400);
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
        const deletedMaterial = await db
          .delete(materialSchema)
          .where(eq(materialSchema.id, material_id));

        return c.json({ data: deletedMaterial }, 200);
      } catch (err) {
        const error = err as Error;

        c.json({ error: error.message }, 500);
      }
    }
  );

export default app;
