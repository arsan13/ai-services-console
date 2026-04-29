export enum PermissionType {
  ADMIN_READ = 'admin:read',
  ADMIN_WRITE = 'admin:write',
  ADMIN_DELETE = 'admin:delete',

  USER_READ = 'user:read',
  USER_WRITE = 'user:write',
  USER_DELETE = 'user:delete',
  USER_MANAGE = 'user:manage',

  TOKEN_USAGE_READ = 'token:usage:read'
}
