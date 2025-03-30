import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { and, eq } from "drizzle-orm";

import { db } from "@/db";
import {
  quizToTag as quizToTagSchema,
  quizTags as quizTagsSchema,
} from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";
import {
  addTagToQuizSchema,
  getTagsByQuizSchema,
  removeTagSchema,
} from "../../schemas/quiz-tags-schema";

const app = new Hono()
  /**
   * Get all tags
   */
  .get(
    "/:id",
    sessionMiddleware,
    zValidator("param", getTagsByQuizSchema),
    async (c) => {
      try {
        const quizId = parseInt(c.req.param("id"));

        if (!quizId) throw new Error("Quiz ID is required !");

        const tags = await db
          .select({
            quizId: quizToTagSchema.quizId,
            tag: quizTagsSchema,
          })
          .from(quizToTagSchema)
          .innerJoin(
            quizTagsSchema,
            eq(quizToTagSchema.tagId, quizTagsSchema.id)
          )
          .where(eq(quizToTagSchema.quizId, quizId));

        return c.json({ data: tags }, 201);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Create tag
   */

  .post(
    "/",
    zValidator("json", addTagToQuizSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const { quizId, tagId } = c.req.valid("json");

        const quiz = await db
          .insert(quizToTagSchema)
          .values({ quizId, tagId })
          .returning();

        return c.json({ data: quiz[0] }, 201);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  )

  /**
   * Delete tag
   */

  .delete(
    "/",
    zValidator("json", removeTagSchema),
    sessionMiddleware,
    async (c) => {
      try {
        const { quizId, tagId } = c.req.valid("json");

        const removedTag = await db
          .delete(quizToTagSchema)
          .where(
            and(
              eq(quizToTagSchema.quizId, quizId),
              eq(quizToTagSchema.tagId, tagId)
            )
          )
          .returning();

        if (!removedTag || removedTag.length === 0) {
          return c.json({ error: "Quiz not found or already deleted" }, 404);
        }

        return c.json({ data: removedTag[0] }, 200);
      } catch (err) {
        const error = err as Error;
        return c.json({ error: error.message }, 500);
      }
    }
  );

export default app;
