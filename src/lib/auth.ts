import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, admin, openAPI } from "better-auth/plugins";

import * as authSchema from "@/features/auth/schema/auth-schema";

import { db } from "@/db";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  plugins: [organization(), admin(), openAPI()],
});

export type Session = typeof auth.$Infer.Session;
