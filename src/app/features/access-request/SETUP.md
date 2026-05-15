# Access Request Module - Setup & Configuration Guide

## Prerequisites

- Angular 21+
- Angular Material
- RxJS
- HttpClient (already configured in the app)

## Installation

The Access Request Module is already integrated into the application. No additional installation steps are required beyond the standard Angular setup.

## Backend API Requirements

Ensure your backend API implements the following endpoints:

### User Endpoints

```
POST   /api/me/access-requests
GET    /api/me/access-requests
GET    /api/me/access-requests/{status}
GET    /api/me/access-requests/{requestId}
POST   /api/me/access-requests/{requestId}/cancel
```

### Admin Endpoints

```
POST   /api/me/access-requests/{requestId}/approve
POST   /api/me/access-requests/{requestId}/reject
```

## Permission Configuration

Add the following permissions to your backend permission system:

```typescript
REQUEST_ACCESS_CREATE    - Allow users to create access requests
REQUEST_ACCESS_VIEW      - Allow users to view their own requests
REQUEST_ACCESS_APPROVE   - Allow admins to approve/reject requests (required for /admin route)
```

These are already defined in `core/models/permission.model.ts`:

```typescript
export const PERMISSIONS = {
  REQUEST_ACCESS_CREATE: 'request_access:create',
  REQUEST_ACCESS_VIEW: 'request_access:view',
  REQUEST_ACCESS_APPROVE: 'request_access:approve',
};
```

## Feature Flags (Optional)

To enable/disable the Access Request feature, you can add feature flags to your configuration:

```typescript
// In your app config
export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    { provide: 'FEATURE_ACCESS_REQUESTS_ENABLED', useValue: true }
  ]
};
```

## Testing the Module

### Run Unit Tests

```bash
npm run test
```

Tests cover:
- Component creation and lifecycle
- Form validation
- API service methods
- Permission guard logic

### Manual Testing

1. **Create Request Flow**
   - Navigate to `/access-requests/create`
   - Fill form with comment and permission selection
   - Submit and verify success message
   - Check redirect to `/access-requests/my-requests`

2. **View Requests Flow**
   - Navigate to `/access-requests/my-requests`
   - Verify requests are displayed with correct status
   - Test pagination navigation
   - Cancel a pending request

3. **Admin Approval Flow**
   - Login as admin user (with REQUEST_ACCESS_APPROVE permission)
   - Navigate to `/access-requests/admin`
   - Approve or reject pending requests with comments
   - Verify requests update with new status

### Test Data

To test the module, create test users with different permissions:

**Test User**
- Permissions: [`request_access:create`, `request_access:view`]
- Can create and view requests, but not approve

**Test Admin**
- Permissions: [`request_access:create`, `request_access:view`, `request_access:approve`]
- Can perform all operations

## Deployment Checklist

- [ ] Backend API endpoints implemented
- [ ] Permission constants defined in backend
- [ ] User roles configured with appropriate permissions
- [ ] Environment variables configured (API URL)
- [ ] Unit tests passing
- [ ] E2E tests passing (if applicable)
- [ ] Accessibility audit completed
- [ ] Documentation reviewed and updated

## Troubleshooting

### Admin Route Inaccessible

**Issue**: User cannot access `/access-requests/admin`

**Solution**: 
- Verify user has `REQUEST_ACCESS_APPROVE` permission
- Check `requestAccessApprovalGuard` is applied to the route
- Verify UserService.currentUser() is properly set after login

### API Calls Failing

**Issue**: Network errors when creating/approving requests

**Solution**:
- Verify backend endpoints are implemented correctly
- Check API base URL in `environment.ts`
- Verify authentication token is being sent (AuthInterceptor)
- Check CORS configuration on backend

### Form Validation Issues

**Issue**: Form shows errors unexpectedly

**Solution**:
- Verify form validators in component:
  - requesterComment: required, minLength(10)
  - permissions: required, minItems(1)
- Check form value before submission: `form.getRawValue()`

### Styling Issues

**Issue**: Components don't look right

**Solution**:
- Verify Material theme is imported in `styles.scss`
- Check CSS file paths are correct
- Clear browser cache and rebuild
- Verify Material icons are loaded

## Performance Optimization

### Lazy Loading
The module is lazy-loaded via the routes configuration:
```typescript
{
  path: 'access-requests',
  canActivate: [AuthGuard],
  children: [
    {
      path: 'create',
      loadComponent: () => import('./features/access-request/create-access-request/...')
    }
    // ...
  ]
}
```

### Change Detection
All components use `OnPush` change detection strategy for optimal performance.

### Pagination
Requests are paginated (default 10 per page) to limit data transfer and improve performance.

## Security Considerations

1. **Authentication**: All routes are protected by `AuthGuard`
2. **Authorization**: Admin routes are protected by `requestAccessApprovalGuard`
3. **Input Validation**: Form validation on both client and should be on server
4. **CSRF Protection**: Requests should include CSRF tokens (handled by interceptors)
5. **SQL Injection**: Backend must use parameterized queries
6. **XSS Protection**: Angular handles template escaping automatically

## Database Schema (Backend Reference)

Consider these fields for the access request table:

```sql
CREATE TABLE access_requests (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  requester_comment VARCHAR(1000),
  reviewer_comment VARCHAR(1000),
  status VARCHAR(20) DEFAULT 'PENDING',
  requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_date TIMESTAMP NULL,
  reviewer_id BIGINT NULL,
  roles JSON,
  permissions JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

CREATE INDEX idx_user_id ON access_requests(user_id);
CREATE INDEX idx_status ON access_requests(status);
CREATE INDEX idx_requested_date ON access_requests(requested_date);
```

## Monitoring & Logging

Monitor these key metrics:
- Average request approval time
- Total pending requests
- Approval vs rejection rate
- User satisfaction with access grants

## Support & Maintenance

For issues or questions:
1. Check the component `README.md` for detailed documentation
2. Review unit tests for usage examples
3. Check browser console for errors
4. Review backend API logs

## Version History

- **v1.0.0** - Initial release
  - User request creation
  - Request viewing with pagination
  - Admin approval/rejection workflow
  - Permission-based access control
