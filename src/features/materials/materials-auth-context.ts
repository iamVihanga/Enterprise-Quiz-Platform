"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

interface SuccessResponse {
  activeOrganization: any;
  activeMember: any;
  permissions: Record<string, boolean | undefined>;
}

interface ErrorResponse {
  error: string;
}

type ReturnType = SuccessResponse | ErrorResponse;

export type MaterialsAuthContext = ReturnType;

export async function materialsAuthContext(): Promise<ReturnType> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    // Get Active Organization
    const activeOrganizationId = session.session.activeOrganizationId;

    if (!activeOrganizationId) {
      throw new Error("No active organization found");
    }

    const activeOrganization = await auth.api.getFullOrganization({
      headers: await headers(),
      organizationId: activeOrganizationId,
    });

    // Get Active Member
    const activeMember = await auth.api.getActiveMember({
      headers: await headers(),
    });

    // Get Permissions
    const actions = ["create", "read", "update", "delete"];
    const permissionsObject: Record<string, boolean | undefined> = {};

    // Check permissions
    await Promise.all(
      actions.map(async (action) => {
        const { error, success } = await auth.api.hasPermission({
          headers: await headers(),
          body: {
            permission: {
              materials: [action] as any,
            },
          },
        });

        permissionsObject[action] = success;
      })
    );

    return { activeOrganization, activeMember, permissions: permissionsObject };
  } catch (err) {
    const error = err as Error;

    return { error: error.message };
  }
}
