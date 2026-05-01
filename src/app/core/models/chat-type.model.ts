import { Permission } from './permission.model';

export const CHAT_TYPE_CODES = {
  AVIATION: 'aviation',
  GENERIC: 'generic',
} as const;

export type ChatTypeCode = typeof CHAT_TYPE_CODES[keyof typeof CHAT_TYPE_CODES];

export interface ChatType {
  code: ChatTypeCode;
  displayName: string;
  permission: Permission;
}
