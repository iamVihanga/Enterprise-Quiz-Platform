import { useEffect, useState } from "react";
import { authClient } from "@/features/auth/auth-client";

export function useLessonPermissions(actions: string[]) {
  const activeOrg = authClient.useActiveOrganization();
  const [checkingAccess, setCheckingAccess] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<
    Record<string, boolean | undefined>
  >({});
  const [activeMember, setActiveMember] = useState<any>(undefined);
  const [activeOrganization, setActiveOrganization] = useState<any>(undefined);

  const handleCheckPermission = async () => {
    if (checkingAccess) return; // Prevent concurrent checks

    try {
      setCheckingAccess(true);

      const permissionsObject: Record<string, boolean | undefined> = {};

      // Check permissions
      await Promise.all(
        actions.map(async (action) => {
          const { data, error } = await authClient.organization.hasPermission({
            permission: {
              lesson: [action] as any,
            },
          });

          permissionsObject[action] = data?.success;
        })
      );

      setPermissions(permissionsObject);

      // Check role
      const orgActiveMember = await authClient.organization.getActiveMember();

      if (orgActiveMember && orgActiveMember.data) {
        setActiveMember(orgActiveMember.data);
      }

      // Update the activeOrganization state
      setActiveOrganization(activeOrg.data);
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingAccess(false);
    }
  };

  useEffect(() => {
    // Only run if we have an organization ID and are not already checking
    if (!activeOrg.data?.id || checkingAccess) {
      return;
    }

    // Key difference: Compare with current activeOrganization to prevent unnecessary checks
    if (activeOrganization?.id !== activeOrg.data.id) {
      handleCheckPermission();
    }
  }, [activeOrg.data?.id, checkingAccess, activeOrganization?.id]);

  return {
    permissions,
    activeMember,
    checkingAccess,
    activeOrganization,
  };
}
