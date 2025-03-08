import {
  createAccessControl,
  defaultStatements,
  adminAc,
  ownerAc,
  memberAc,
} from "better-auth/plugins/access";

/**
 * make sure to use `as const` so typescript can infer the type correctly
 */
const statement = {
  ...defaultStatements,
  lesson: ["create", "read", "share", "update", "delete"],
  materials: ["create", "read", "share", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const member = ac.newRole({
  lesson: ["read", "share"],
  materials: ["read"],
  ...memberAc.statements,
});

export const admin = ac.newRole({
  lesson: ["read", "create", "update", "share", "delete"],
  materials: ["read", "create", "update", "share", "delete"],
  ...adminAc.statements,
});

export const owner = ac.newRole({
  lesson: ["create", "read", "share", "update", "delete"],
  materials: ["create", "read", "share", "update", "delete"],
  ...ownerAc.statements,
});
