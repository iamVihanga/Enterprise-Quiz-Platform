import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  foreignKey,
  primaryKey,
} from "drizzle-orm/pg-core";
import { organization, user, lessons } from "@/db/schema";

// Quiz table to store quiz metadata
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnail: text("thumbnail"),
  timeLimit: integer("time_limit"), // in seconds, null means no time limit
  passingScore: integer("passing_score"), // minimum score to pass the quiz (percentage)
  isPublished: boolean("is_published").default(false).notNull(),
  shuffleQuestions: boolean("shuffle_questions").default(false).notNull(),
  showCorrectAnswers: boolean("show_correct_answers").default(true).notNull(),
  allowRetakes: boolean("allow_retakes").default(true).notNull(),
  maxAttempts: integer("max_attempts"), // null means unlimited attempts
  lessonId: integer("lesson_id").references(() => lessons.id, {
    onDelete: "cascade",
  }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectQuiz = typeof quizzes.$inferSelect;

// Question types enum
export const questionTypes = [
  "multiple_choice",
  "true_false",
  "short_answer",
  "matching",
  "fill_in_blank",
] as const;

export type QuestionType = (typeof questionTypes)[number];

// Questions table
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: text("question_type").$type<QuestionType>().notNull(),
  explanation: text("explanation"), // Optional explanation for the answer
  points: integer("points").default(1).notNull(), // Points awarded for correct answer
  orderIndex: integer("order_index").notNull(), // To maintain question order
  isRequired: boolean("is_required").default(true).notNull(),
  mediaUrl: text("media_url"), // Optional image, video, or audio URL
  options: jsonb("options"), // For multiple choice, matching, etc.
  correctAnswer: jsonb("correct_answer").notNull(), // The correct answer(s)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SelectQuestion = typeof questions.$inferSelect;

// Quiz attempts to track user attempts
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
  score: integer("score"), // Final score (percentage)
  totalPoints: integer("total_points"),
  earnedPoints: integer("earned_points"),
  passingScore: integer("passing_score"), // Copy of quiz passing score at time of attempt
  passed: boolean("passed"), // Whether the user passed the quiz
  timeSpent: integer("time_spent"), // in seconds
  attemptNumber: integer("attempt_number").notNull(), // Which attempt this is for the user
});

export type SelectQuizAttempt = typeof quizAttempts.$inferSelect;

// User responses to questions
export const questionResponses = pgTable("question_responses", {
  id: serial("id").primaryKey(),
  quizAttemptId: integer("quiz_attempt_id")
    .notNull()
    .references(() => quizAttempts.id, { onDelete: "cascade" }),
  questionId: integer("question_id")
    .notNull()
    .references(() => questions.id, { onDelete: "cascade" }),
  userAnswer: jsonb("user_answer"), // User's answer in a format that matches the question type
  isCorrect: boolean("is_correct"),
  pointsEarned: integer("points_earned").default(0).notNull(),
  responseTime: integer("response_time"), // Time taken to answer in seconds
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SelectQuestionResponse = typeof questionResponses.$inferSelect;

// Quiz tags for categorization
export const quizTags = pgTable("quiz_tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SelectQuizTag = typeof quizTags.$inferSelect;

// Junction table for quiz-tag relationship
export const quizToTag = pgTable(
  "quiz_to_tag",
  {
    quizId: integer("quiz_id")
      .notNull()
      .references(() => quizzes.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => quizTags.id, { onDelete: "cascade" }),
  },
  (table) => [
    // Return an array instead of an object
    primaryKey({ columns: [table.quizId, table.tagId] }),
  ]
);

// Quiz feedback from users
export const quizFeedback = pgTable("quiz_feedback", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  rating: integer("rating"), // 1-5 star rating
  comment: text("comment"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SelectQuizFeedback = typeof quizFeedback.$inferSelect;
