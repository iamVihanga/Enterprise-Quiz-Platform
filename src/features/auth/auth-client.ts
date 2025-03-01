import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";

import { ac, admin, member, owner } from "@/features/auth/permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL, // the base url of your auth server
  plugins: [
    adminClient(),
    organizationClient({
      ac: ac,
      roles: {
        owner,
        admin,
        member,
      },
    }),
  ],
});
