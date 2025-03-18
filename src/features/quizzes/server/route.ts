import { Hono } from "hono";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db";
import {
  quizzes as quizzesSchema,
  questions as questionsSchema,
} from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";
import { auth } from "@/lib/auth";
import {
  addQuizSchema,
  updateQuizSchema,
  deleteQuizSchema,
  findByIdQuizSchema,
  addQuestionSchema,
  addMutltipleQuestionsSchema,
} from "@/features/quizzes/schemas/zod-quiz-schema";

type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
  lessonId?: string;
};

const app = new Hono()
  /**
   * Fetch all quizzes (GET: /)
   */
  .get("/", sessionMiddleware, async (c) => {
    try {
      const {
        page = "1",
        limit = "10",
        search = "",
        lessonId = "",
      } = c.req.query() as QueryParams;

      // Get active organization
      const activeOrganizationId = c.get("session")?.activeOrganizationId;

      if (!activeOrganizationId) {
        return c.json(
          { error: "You must have an active organization to fetch quizzes" },
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
        .from(quizzesSchema)
        .where(eq(quizzesSchema.organizationId, activeOrganizationId))
        .$dynamic();

      // Build the main query for items
      const itemsQuery = db
        .select()
        .from(quizzesSchema)
        .where(eq(quizzesSchema.organizationId, activeOrganizationId))
        .$dynamic();

      // Add lesson filter if provided
      if (lessonId && parseInt(lessonId) > 0) {
        const lessonIdNum = parseInt(lessonId);
        countQuery.where(eq(quizzesSchema.lessonId, lessonIdNum));
        itemsQuery.where(eq(quizzesSchema.lessonId, lessonIdNum));
      }

      // Add search condition if search parameter exists
      if (search) {
        const searchCondition = and(
          ilike(quizzesSchema.title, `%${search}%`),
          eq(quizzesSchema.organizationId, activeOrganizationId)
        );

        countQuery.where(searchCondition);
        itemsQuery.where(searchCondition);
      }

      // Execute both queries
      const [countResult] = await countQuery;
      const items = await itemsQuery
        .limit(limitNum)
        .offset(offset)
        .orderBy(desc(quizzesSchema.createdAt));

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
   * Fetch quiz by ID (GET: /:id)
   */
  .get(
    "/:id",
    sessionMiddleware,
    zValidator("param", findByIdQuizSchema),
    async (c) => {
      try {
        // Validate quiz id
        const quiz_id = parseInt(c.req.param("id"));

        if (!quiz_id) {
          return c.json({ error: "Quiz ID is required" }, 400);
        }

        // Get active organization
        const activeOrganizationId = c.get("session")?.activeOrganizationId;

        if (!activeOrganizationId) {
          return c.json(
            { error: "You must have an active organization to fetch quizzes" },
            403
          );
        }

        // Fetch quiz by ID
        const quiz = await db
          .select()
          .from(quizzesSchema)
          .where(eq(quizzesSchema.id, quiz_id))
          .limit(1);

        if (!quiz || quiz.length === 0) {
          return c.json({ error: "Quiz not found" }, 404);
        }

        // Fetch questions for this quiz
        const questions = await db
          .select()
          .from(questionsSchema)
          .where(eq(questionsSchema.quizId, quiz_id))
          .orderBy(questionsSchema.orderIndex);

        return c.json(
          {
            data: {
              ...quiz[0],
              questions,
            },
          },
          200
        );
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Create new quiz (POST: /)
   */
  .post(
    "/",
    zValidator("json", addQuizSchema),
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
            { error: "You don't have permission to create quizzes" },
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

        if (!userId) {
          return c.json(
            { error: "You must be logged in to create quizzes" },
            403
          );
        }

        // Create new quiz with server-managed fields
        const now = new Date();
        const quiz = await db
          .insert(quizzesSchema)
          .values({
            ...validFormData,
            organizationId: activeOrganizationId,
            createdBy: userId,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        return c.json({ data: quiz[0] }, 201);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Update quiz by ID (PUT: /:id)
   */
  .put(
    "/:id",
    zValidator("form", updateQuizSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const quiz_id = parseInt(c.req.param("id"));

        if (!quiz_id) {
          return c.json({ error: "Quiz ID is required" }, 400);
        }

        // Check user has permission to update quiz
        const hasPermission = await auth.api.hasPermission({
          headers: await headers(),
          body: {
            permission: {
              quizzes: ["update"],
            },
          },
        });

        if (hasPermission.error || !hasPermission.success) {
          return c.json(
            { error: "You don't have permission to update quizzes" },
            403
          );
        }

        const validFormData = c.req.valid("form");

        // Update quiz with server-managed fields
        const now = new Date();
        const updatedQuiz = await db
          .update(quizzesSchema)
          .set({
            ...validFormData,
            updatedAt: now,
          })
          .where(eq(quizzesSchema.id, quiz_id))
          .returning();

        if (!updatedQuiz || updatedQuiz.length === 0) {
          return c.json({ error: "Quiz not found" }, 404);
        }

        return c.json({ data: updatedQuiz[0] }, 200);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Delete quiz by ID (DELETE: /:id)
   */
  .delete(
    "/:id",
    sessionMiddleware,
    zValidator("param", deleteQuizSchema),
    async (c) => {
      try {
        const quiz_id = parseInt(c.req.param("id"));

        if (!quiz_id) {
          return c.json({ error: "Quiz ID is required" }, 400);
        }

        // Check user has permission to delete quiz
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
            { error: "You don't have permission to delete quizzes" },
            403
          );
        }

        // Delete quiz (cascade will delete related questions due to foreign key constraint)
        const deletedQuiz = await db
          .delete(quizzesSchema)
          .where(eq(quizzesSchema.id, quiz_id))
          .returning();

        if (!deletedQuiz || deletedQuiz.length === 0) {
          return c.json({ error: "Quiz not found or already deleted" }, 404);
        }

        return c.json({ data: deletedQuiz[0] }, 200);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Questions endpoints
   */

  /**
   * Add a question to a quiz (POST: /:quizId/questions)
   */
  .post(
    "/:id/questions",
    sessionMiddleware,
    zValidator("form", addQuestionSchema),
    async (c) => {
      try {
        const quiz_id = parseInt(c.req.param("id"));

        if (!quiz_id) {
          return c.json({ error: "Quiz ID is required" }, 400);
        }

        // Check user has permission
        const hasPermission = await auth.api.hasPermission({
          headers: await headers(),
          body: {
            permission: {
              quizzes: ["update"],
            },
          },
        });

        if (hasPermission.error || !hasPermission.success) {
          return c.json(
            { error: "You don't have permission to add questions" },
            403
          );
        }

        const validFormData = c.req.valid("form");

        // Check if quiz exists
        const quiz = await db
          .select()
          .from(quizzesSchema)
          .where(eq(quizzesSchema.id, quiz_id))
          .limit(1);

        if (!quiz || quiz.length === 0) {
          return c.json({ error: "Quiz not found" }, 404);
        }

        // Get the highest order index to place the new question at the end
        const maxOrderQuery = await db
          .select({
            maxOrder: sql<number>`COALESCE(MAX(${questionsSchema.orderIndex}), 0)`,
          })
          .from(questionsSchema)
          .where(eq(questionsSchema.quizId, quiz_id));

        const nextOrderIndex = (maxOrderQuery[0]?.maxOrder || 0) + 1;

        // Create new question
        const now = new Date();
        const newQuestion = await db
          .insert(questionsSchema)
          .values({
            ...validFormData,
            quizId: quiz_id,
            orderIndex: nextOrderIndex,
            createdAt: now,
            updatedAt: now,
          })
          .returning();

        return c.json({ data: newQuestion[0] }, 201);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Add multiple questions to a quiz at once (POST: /:quizId/questions-list)
   */
  .post(
    "/:id/questions-list",
    sessionMiddleware,
    zValidator("json", addMutltipleQuestionsSchema),
    async (c) => {
      try {
        const quiz_id = parseInt(c.req.param("id"));

        if (!quiz_id) {
          return c.json({ error: "Quiz ID is required" }, 400);
        }

        // Check user has permission
        const hasPermission = await auth.api.hasPermission({
          headers: await headers(),
          body: {
            permission: {
              quizzes: ["update"],
            },
          },
        });

        if (hasPermission.error || !hasPermission.success) {
          return c.json(
            { error: "You don't have permission to add questions" },
            403
          );
        }

        const questions = c.req.valid("json");

        // Check if quiz exists
        const quiz = await db
          .select()
          .from(quizzesSchema)
          .where(eq(quizzesSchema.id, quiz_id))
          .limit(1);

        if (!quiz || quiz.length === 0) {
          return c.json({ error: "Quiz not found" }, 404);
        }

        // Get the highest order index to start our sequence from
        const maxOrderQuery = await db
          .select({
            maxOrder: sql<number>`COALESCE(MAX(${questionsSchema.orderIndex}), 0)`,
          })
          .from(questionsSchema)
          .where(eq(questionsSchema.quizId, quiz_id));

        const startOrderIndex = (maxOrderQuery[0]?.maxOrder || 0) + 1;

        // Prepare the questions for bulk insertion
        const now = new Date();
        const questionsToInsert = questions.map((question, index) => ({
          ...question,
          quizId: quiz_id,
          orderIndex: startOrderIndex + index,
          createdAt: now,
          updatedAt: now,
        }));

        // Bulk insert all questions
        const newQuestions = await db
          .insert(questionsSchema)
          .values(questionsToInsert)
          .returning();

        return c.json({ data: newQuestions }, 201);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  );

export default app;
