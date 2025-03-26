import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

import { db } from "@/db";
import { questions as questionsSchema } from "@/db/schema/index";
import { auth } from "@/lib/auth";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";
import {
  updateQuestionSchema,
  deleteQuestionSchema,
} from "@/features/quizzes/schemas/zod-quiz-schema";

const app = new Hono()
  /**
   * Update a question (PUT: /questions/:questionId)
   */
  .put(
    "/questions/:questionId",
    sessionMiddleware,
    zValidator("json", updateQuestionSchema),
    async (c) => {
      try {
        const question_id = parseInt(c.req.param("questionId"));

        if (!question_id) {
          return c.json({ error: "Question ID is required" }, 400);
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
            { error: "You don't have permission to update questions" },
            403
          );
        }

        const validFormData = c.req.valid("json");

        // Update question
        const now = new Date();
        const updatedQuestion = await db
          .update(questionsSchema)
          .set({
            ...validFormData,
            updatedAt: now,
          })
          .where(eq(questionsSchema.id, question_id))
          .returning();

        if (!updatedQuestion || updatedQuestion.length === 0) {
          return c.json({ error: "Question not found" }, 404);
        }

        return c.json({ data: updatedQuestion[0] }, 200);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Delete a question (DELETE: /questions/:questionId)
   */
  .delete(
    "/questions/:questionId",
    sessionMiddleware,
    zValidator("param", deleteQuestionSchema),
    async (c) => {
      try {
        const question_id = c.req.param("questionId");

        if (!question_id) {
          return c.json({ error: "Question ID is required" }, 400);
        }

        // Check user has permission
        const { error: permissionErr, success: hasPermission } =
          await auth.api.hasPermission({
            headers: await headers(),
            body: {
              permission: {
                quizzes: ["update"],
              },
            },
          });

        if (!hasPermission || permissionErr) {
          return c.json(
            { error: "You don't have permission to delete questions" },
            403
          );
        }

        // Delete question
        const deletedQuestion = await db
          .delete(questionsSchema)
          .where(eq(questionsSchema.id, parseInt(question_id)))
          .returning();

        if (!deletedQuestion || deletedQuestion.length === 0) {
          return c.json(
            { error: "Question not found or already deleted" },
            404
          );
        }

        // Re-order remaining questions to keep indexes consecutive
        const questionsToReorder = await db
          .select()
          .from(questionsSchema)
          .where(eq(questionsSchema.quizId, deletedQuestion[0].quizId))
          .orderBy(questionsSchema.orderIndex);

        // Update order indexes for remaining questions
        for (let i = 0; i < questionsToReorder.length; i++) {
          await db
            .update(questionsSchema)
            .set({ orderIndex: i + 1 })
            .where(eq(questionsSchema.id, questionsToReorder[i].id));
        }

        return c.json({ data: deletedQuestion[0] }, 200);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  );

export default app;
