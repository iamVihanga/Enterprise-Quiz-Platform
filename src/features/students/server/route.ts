import { Hono } from "hono";
import { and, desc, ilike, sql, eq } from "drizzle-orm";

import { db } from "@/db";
import { user as userSchema, member as memberSchema } from "@/db/schema/index";

import { sessionMiddleware } from "@/features/auth/middlewares/session-middleware";

type QueryParams = {
  page?: string;
  limit?: string;
  search?: string;
};

const app = new Hono().get("/", sessionMiddleware, async (c) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user || user?.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const activeOrganizationId = session?.activeOrganizationId;

  if (!activeOrganizationId) {
    return c.json({ error: "No active organization found" }, 500);
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

  // Build the base query conditions
  const baseConditions = and(
    eq(memberSchema.organizationId, activeOrganizationId),
    eq(memberSchema.role, "member")
  );

  // Add search condition if search parameter exists
  const searchCondition = search
    ? and(baseConditions, ilike(userSchema.name, `%${search}%`))
    : baseConditions;

  // Count query for total number of records
  const countQuery = db
    .select({
      count: sql<number>`cast(count(*) as integer)`,
    })
    .from(memberSchema)
    .leftJoin(userSchema, eq(memberSchema.userId, userSchema.id))
    .where(searchCondition)
    .$dynamic();

  // Main query for fetching students with pagination
  const studentsQuery = db
    .select({
      member: memberSchema,
      user: userSchema,
    })
    .from(memberSchema)
    .leftJoin(userSchema, eq(memberSchema.userId, userSchema.id))
    .where(searchCondition)
    .limit(limitNum)
    .offset(offset)
    .orderBy(desc(memberSchema.createdAt))
    .$dynamic();

  // Execute both queries
  const [countResult] = await countQuery;
  const students = await studentsQuery;

  const total = countResult.count;

  // Transform the results to include only necessary user information
  const transformedStudents = students.map(({ user, member }) => ({
    id: member.id,
    userId: user?.id,
    name: user?.name,
    email: user?.email,
    image: user?.image,
    role: member.role,
    createdAt: member.createdAt,
  }));

  return c.json(
    {
      data: transformedStudents,
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
