import { z } from "zod";
import { questionTypes, type QuestionType } from "@/db/schema";

// Base schema for quiz creation and updates
const quizBaseSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  timeLimit: z.number().int().positive().optional(),
  passingScore: z
    .number()
    .int()
    .min(0, "Passing score must be at least 0")
    .max(100, "Passing score cannot exceed 100")
    .optional(),
  isPublished: z.boolean().optional(),
  shuffleQuestions: z.boolean().optional(),
  showCorrectAnswers: z.boolean().optional(),
  allowRetakes: z.boolean().optional(),
  maxAttempts: z
    .number()
    .int()
    .positive("Max attempts must be at least 1")
    .optional(),
  lessonId: z.number().int().positive().optional(),
});

// Schema for creating a new quiz
export const addQuizSchema = quizBaseSchema;

// Schema for updating an existing quiz
export const updateQuizSchema = quizBaseSchema;

// Schema for quiz ID parameter validation
export const findByIdQuizSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Quiz ID must be a valid number",
  }),
});

// Schema for quiz deletion parameter validation
export const deleteQuizSchema = z.object({
  id: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Quiz ID must be a valid number",
  }),
});

// Schema for question ID parameter validation
export const deleteQuestionSchema = z.object({
  questionId: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Question ID must be a valid number",
  }),
});

// Use the question types from the database schema
const questionTypeEnum = z.enum(questionTypes);

// Schema for multiple choice questions
const multipleChoiceOptionsSchema = z.object({
  options: z
    .array(
      z.object({
        id: z.string(),
        text: z.string().min(1, "Option text is required"),
      })
    )
    .min(2, "At least 2 options are required"),
});

// Schema for matching questions
const matchingOptionsSchema = z.object({
  pairs: z
    .array(
      z.object({
        id: z.string(),
        prompt: z.string().min(1, "Prompt is required"),
        match: z.string().min(1, "Match is required"),
      })
    )
    .min(2, "At least 2 pairs are required"),
});

// Schema for fill in the blank questions
const fillInBlankOptionsSchema = z.object({
  blanks: z.array(
    z.object({
      id: z.string(),
      correctAnswer: z.string().min(1, "Answer is required"),
      caseSensitive: z.boolean().optional(),
    })
  ),
});

// Base schema for question creation
const questionBaseSchema = z.object({
  questionText: z.string().min(1, "Question text is required"),
  // questionType: questionTypeEnum,
  explanation: z.string().optional(),
  points: z.number().int().positive().default(1),
  isRequired: z.boolean().optional().default(true),
  mediaUrl: z.string().optional(),
});

// Create a discriminated union for different question types
const questionWithOptionsSchema = z.discriminatedUnion("questionType", [
  z
    .object({
      questionType: z.literal("multiple_choice"),
      options: multipleChoiceOptionsSchema.shape.options,
      correctAnswer: z
        .array(z.string())
        .min(1, "At least one correct answer is required"),
    })
    .merge(questionBaseSchema),

  z
    .object({
      questionType: z.literal("true_false"),
      correctAnswer: z.boolean(),
    })
    .merge(questionBaseSchema),

  z
    .object({
      questionType: z.literal("short_answer"),
      correctAnswer: z
        .array(z.string())
        .min(1, "At least one correct answer is required"),
      caseSensitive: z.boolean().optional().default(false),
    })
    .merge(questionBaseSchema),

  z
    .object({
      questionType: z.literal("matching"),
      options: matchingOptionsSchema.shape.pairs,
      correctAnswer: z.record(z.string(), z.string()),
    })
    .merge(questionBaseSchema),

  z
    .object({
      questionType: z.literal("fill_in_blank"),
      options: fillInBlankOptionsSchema.shape.blanks,
      correctAnswer: z.record(z.string(), z.string()),
    })
    .merge(questionBaseSchema),
]);

// Final schema for adding a question
export const addQuestionSchema = questionWithOptionsSchema;

// Schema for updating a question - same as adding, but with ID
export const updateQuestionSchema = questionWithOptionsSchema;

// Export types that leverage the DB schema types
export type AddQuizInput = z.infer<typeof addQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type AddQuestionInput = z.infer<typeof addQuestionSchema>;
export type UpdateQuestionInput = z.infer<typeof updateQuestionSchema>;

// Re-export the QuestionType from DB schema for consistency
export { QuestionType };
