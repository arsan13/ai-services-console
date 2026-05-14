export const PERMISSIONS = {
  ADMIN_READ: 'admin:read',
  ADMIN_WRITE: 'admin:write',

  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',

  TOKEN_USAGE_READ: 'token:usage:read',

  CHAT_AVIATION_USE: 'chat:aviation:use',
  CHAT_GENERIC_USE: 'chat:generic:use',
  REQUEST_ACCESS_CREATE: 'request:access:create',
  REQUEST_ACCESS_VIEW: 'request:access:view',
  REQUEST_ACCESS_APPROVE: 'request:access:approve',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];