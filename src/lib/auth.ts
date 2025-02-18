import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, admin, openAPI } from "better-auth/plugins";

import * as authSchema from "@/features/auth/schema/auth-schema";

import { db } from "@/db";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: authSchema,
  }),
  plugins: [
    organization({
      allowUserToCreateOrganization(user) {
        const isAdmin = (user as any)?.role === "admin";
        return isAdmin;
      },

      async sendInvitationEmail(data, request) {
        const inviteLink = `${process.env.SITE_URL}/accept-invitation/${data.id}`;

        console.log({ inviteLink });

        // TODO: implement sending email functionality

        // TODO: Implement sending notification functionality
      },
    }),
    admin(),
    openAPI(),
  ],
});

export type Session = typeof auth.$Infer.Session;
