import { AccessRequestStatus } from '../enums/access-request-status.enum';
import { RoleType } from '../enums/role-type.enum';

export interface CreateAccessRequestPayload {
  requesterComment: string;
  permissions?: string[];
  roles?: string[];
}

export interface PendingRolesPermissions {
  roles: RoleType[];
  permissions: string[];
}

export interface UserAccessRequestResponse {
  id: number;
  reviewerName: string;
  status: AccessRequestStatus;
  requesterComment: string;
  reviewerComment: string;
  roles: RoleType[];
  permissions: string[];
  requestedDate: string;
  reviewedDate: string | null;
}

export interface AdminAccessRequestSummary {
  id: number;
  requesterId: number;
  requesterName: string;
  reviewerId: number | null;
  reviewerName: string;
  status: AccessRequestStatus;
  requesterComment: string;
  reviewerComment: string;
  roles: RoleType[];
  permissions: string[];
  requestedDate: string;
  reviewedDate: string | null;
}

export interface ReviewAccessRequestPayload {
  requestId: number;
  status: AccessRequestStatus.APPROVED | AccessRequestStatus.REJECTED;
  reviewerComment: string;
}

export interface RevokeAccessRequestPayload {
  requestId: number;
  reviewerComment: string;
}
