import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AdminAccessRequestService } from './admin-access-request.service';
import { AccessRequestStatus } from '../enums/access-request-status.enum';

describe('AdminAccessRequestService', () => {
  let service: AdminAccessRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdminAccessRequestService]
    });

    service = TestBed.inject(AdminAccessRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all admin access requests', () => {
    const mockPage = {
      content: [],
      totalPages: 1,
      totalElements: 0,
      size: 10,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 0,
      first: true,
      last: true,
      pageable: {
        offset: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        paged: true,
        pageNumber: 0,
        pageSize: 10,
        unpaged: false
      },
      empty: true
    };

    service.getAllAccessRequests(0, 10).subscribe(result => {
      expect(result).toEqual(mockPage);
    });

    const req = httpMock.expectOne(req => req.url.includes('/admin/access-requests'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should get admin access requests by status', () => {
    const mockPage = {
      content: [],
      totalPages: 1,
      totalElements: 0,
      size: 10,
      number: 0,
      sort: { empty: true, sorted: false, unsorted: true },
      numberOfElements: 0,
      first: true,
      last: true,
      pageable: {
        offset: 0,
        sort: { empty: true, sorted: false, unsorted: true },
        paged: true,
        pageNumber: 0,
        pageSize: 10,
        unpaged: false
      },
      empty: true
    };

    service.getAccessRequestsByStatus(AccessRequestStatus.PENDING, 0, 10).subscribe(result => {
      expect(result).toEqual(mockPage);
    });

    const req = httpMock.expectOne(req => req.url.includes('/admin/access-requests/status/PENDING'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should review access request', () => {
    const mockRequest = {
      id: 1,
      requesterId: 12,
      requesterName: 'Requester User',
      reviewerId: 21,
      requesterComment: 'Need access',
      permissions: ['chat:aviation:use'],
      roles: ['ROLE_USER'],
      status: AccessRequestStatus.APPROVED,
      reviewerName: 'Admin User',
      reviewerComment: 'Approved',
      requestedDate: '2026-05-13T14:31:21.326Z',
      reviewedDate: '2026-05-13T14:32:21.326Z'
    };

    service.reviewAccessRequest({
      requestId: 1,
      status: AccessRequestStatus.APPROVED,
      reviewerComment: 'Approved'
    }).subscribe(result => {
      expect(result.status).toBe(AccessRequestStatus.APPROVED);
    });

    const req = httpMock.expectOne(req => req.url.includes('/admin/access-requests/review'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockRequest);
  });

  it('should revoke access request', () => {
    const mockRequest = {
      id: 1,
      requesterId: 12,
      requesterName: 'Requester User',
      reviewerId: 21,
      requesterComment: 'Need access',
      permissions: ['chat:aviation:use'],
      roles: ['ROLE_USER'],
      status: AccessRequestStatus.REVOKED,
      reviewerName: 'Admin User',
      reviewerComment: 'Revoked',
      requestedDate: '2026-05-13T14:31:21.326Z',
      reviewedDate: '2026-05-13T14:32:21.326Z'
    };

    service.revokeAccessRequest({ requestId: 1, reviewerComment: 'Revoked' }).subscribe(result => {
      expect(result.status).toBe(AccessRequestStatus.REVOKED);
    });

    const req = httpMock.expectOne(req => req.url.includes('/admin/access-requests/revoke'));
    expect(req.request.method).toBe('PUT');
    req.flush(mockRequest);
  });
});
