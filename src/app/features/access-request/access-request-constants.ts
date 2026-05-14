// Central constants for access request features
import { AccessRequestStatus } from '../../core/enums/access-request-status.enum';

export const ACCESS_REQUEST_PAGE_SIZE = 10;

export const ACCESS_REQUEST_STATUS_OPTIONS = [
  'ALL',
  AccessRequestStatus.PENDING,
  AccessRequestStatus.APPROVED,
  AccessRequestStatus.REJECTED,
  AccessRequestStatus.REVOKED,
  AccessRequestStatus.CANCELLED
] as const;
