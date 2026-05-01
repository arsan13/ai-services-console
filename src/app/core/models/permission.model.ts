export const PERMISSIONS = {
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write',
  ADMIN_DELETE: 'admin:delete',

  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',

  TOKEN_USAGE_READ: 'token:usage:read',

  CHAT_AVIATION_USE: 'chat:aviation:use',
  CHAT_GENERIC_USE: 'chat:generic:use',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];