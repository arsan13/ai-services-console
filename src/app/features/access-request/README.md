# Access Request Module

## Overview

The Access Request Module is an enterprise-level feature that enables users to request additional roles and/or permissions, and allows administrators to review, approve, or reject these requests.

## Features

### User Features
- **Create Access Requests**: Users can request specific permissions or roles with a comment explaining their need
- **View All Requests**: Users can view all their access requests with filtering and pagination
- **Cancel Requests**: Users can cancel pending requests
- **Track Status**: Users can monitor the status of their requests (PENDING, APPROVED, REJECTED, CANCELED, REVOKED)

### Admin Features
- **View Pending Requests**: Admins can view all pending access requests from other users
- **Approve Requests**: Admins can approve requests with a reviewer comment
- **Reject Requests**: Admins can reject requests with a reviewer comment and feedback
- **Pagination**: Support for handling large volumes of requests

## User Permissions

The following permissions control access to this module:

- `REQUEST_ACCESS_CREATE`: Required to create access requests
- `REQUEST_ACCESS_VIEW`: Required to view own access requests
- `REQUEST_ACCESS_APPROVE`: Required to approve or reject requests (admin permission)

## Architecture

### Components

#### User-Facing Components

1. **CreateAccessRequestComponent** (`features/access-request/create-access-request/`)
   - Path: `/access-requests/create`
   - Allows users to create a new access request
   - Requires comment and at least one permission selection
   - Inputs: List of available permissions
   - Output: Success message and redirect to my-requests

2. **MyAccessRequestsComponent** (`features/access-request/my-access-requests/`)
   - Path: `/access-requests/my-requests`
   - Displays all user's access requests with pagination
   - Allows cancellation of PENDING requests
   - Shows request details including dates, status, and reviewer comments

#### Admin Components

3. **AdminApprovalsComponent** (`features/access-request/admin-approvals/`)
   - Path: `/access-requests/admin`
   - Protected by `requestAccessApprovalGuard` (requires `REQUEST_ACCESS_APPROVE` permission)
   - Displays all pending requests from all users
   - Allows approval/rejection with reviewer comments
   - Supports pagination for handling multiple requests

### Services

**UserAccessRequestService** (`core/services/user-access-request.service.ts`)

API Methods:
- `createAccessRequest(payload)`: POST `/me/access-requests`
- `getAllAccessRequests(page, size)`: GET `/me/access-requests?page=0&size=10`
- `getAccessRequestsByStatus(status, page, size)`: GET `/me/access-requests/{status}?page=0&size=10`
- `getAccessRequestById(requestId)`: GET `/me/access-requests/{requestId}`
- `cancelAccessRequest(requestId)`: POST `/me/access-requests/{requestId}/cancel`

**AdminAccessRequestService** (`core/services/admin-access-request.service.ts`)

- `getAllAccessRequests(page, size)`: GET `/admin/access-requests?page=0&size=10`
- `getAccessRequestsByStatus(status, page, size)`: GET `/admin/access-requests/{status}?page=0&size=10`
- `getAccessRequestById(requestId)`: GET `/admin/access-requests/{requestId}`
- `reviewAccessRequest(payload)`: PUT `/admin/access-requests/review`
- `revokeAccessRequest(payload)`: PUT `/admin/access-requests/revoke`

### Models

**DTO Models** (`core/models/access-request.model.ts`)

```typescript
interface UserAccessRequestResponse {
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

interface AdminAccessRequestSummary {
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

interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

enum AccessRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
  REVOKED = 'REVOKED',
}
```

### Guards

**requestAccessApprovalGuard** (`core/guards/request-access-approval.guard.ts`)

- Protects the `/access-requests/admin` route
- Checks if user has `REQUEST_ACCESS_APPROVE` permission
- Redirects unauthorized users to home page

## Routes

```
/access-requests
  ├── /create                    - Create new access request
  ├── /my-requests               - View user's requests
  └── /admin                     - Admin approval dashboard (guarded)
```

All routes require `AuthGuard` to ensure user is authenticated.

## API Endpoints

### User Endpoints

**Create Access Request**
```
POST /api/me/access-requests
Content-Type: application/json
Authorization: Bearer <token>

{
  "requesterComment": "string",
  "permissions": ["string"],
  "roles": ["string"]
}

Response: UserAccessRequestResponse
```

**Get All User's Requests**
```
GET /api/me/access-requests?page=0&size=10
Authorization: Bearer <token>

Response: Page<UserAccessRequestResponse>
```

**Get Requests by Status**
```
GET /api/me/access-requests/{status}?page=0&size=10
Authorization: Bearer <token>

Response: Page<UserAccessRequestResponse>
```

**Get Request Details**
```
GET /api/me/access-requests/{requestId}
Authorization: Bearer <token>

Response: UserAccessRequestResponse
```

**Cancel Request**
```
POST /api/me/access-requests/{requestId}/cancel
Authorization: Bearer <token>

Response: void
```

### Admin Endpoints

**Review Request**
```
PUT /api/admin/access-requests/review
Content-Type: application/json
Authorization: Bearer <token>

{
  "requestId": 1,
  "status": "APPROVED",
  "reviewerComment": "string"
}

Response: AdminAccessRequestSummary
```

**Revoke Request**
```
PUT /api/admin/access-requests/revoke
Content-Type: application/json
Authorization: Bearer <token>

{
  "requestId": 1,
  "reviewerComment": "string"
}

Response: AdminAccessRequestSummary (with status = REVOKED)
```

## Usage Examples

### User: Create Access Request

1. Navigate to `/access-requests/create`
2. Enter a comment explaining why access is needed (minimum 10 characters)
3. Select one or more permissions from the dropdown
4. Click "Request Access"
5. Receive success confirmation and redirect to requests list

### User: View Requests

1. Navigate to `/access-requests/my-requests`
2. View all requests with status badges
3. Pagination controls to navigate between pages
4. Click "View Details" for more information
5. For PENDING requests, click "Cancel Request" to withdraw

### Admin: Approve/Reject Requests

1. User with `REQUEST_ACCESS_APPROVE` permission navigates to `/access-requests/admin`
2. View all pending access requests
3. For each request:
   - Enter a reviewer comment (required)
   - Click "Approve" or "Reject"
   - Request is updated with admin action and comment

## State Management

The module uses Angular Signals for state management:
- `isLoading`: Shows loading spinner during async operations
- `requests`: Array of access requests
- `currentPage`: Current pagination page
- `totalPages`: Total number of pages
- `processingIds`: Set of request IDs currently being processed
- `successMessage`: Success notification message

## Styling

- Uses Material Design components (MatCard, MatButton, MatFormField, etc.)
- Responsive grid layout for request cards
- Color-coded status badges:
  - PENDING: Orange (#ff9800)
  - APPROVED: Green (#4caf50)
  - REJECTED: Red (#f44336)
  - CANCELED: Gray (#999)

## Testing

Unit tests are included for:
- Components: Form validation, navigation, pagination, API calls
- Service: All CRUD operations and HTTP methods
- Guards: Permission checking and routing

Run tests with:
```bash
npm run test
```

## Error Handling

- Failed API calls display snack bar notifications
- Form validation provides inline error messages
- Confirmation dialogs for destructive actions (cancel, reject)
- Graceful fallback for missing data

## Accessibility

- Semantic HTML structure
- ARIA labels on form fields
- Keyboard navigation support
- Adequate color contrast for status badges
- Focus management in modals

## Future Enhancements

- Search and filter requests by date, status, or keyword
- Export requests to CSV/PDF
- Bulk approval/rejection actions
- Email notifications for status changes
- Request templates for common permission sets
- Audit trail of all approvals and rejections
- Analytics dashboard for request metrics
