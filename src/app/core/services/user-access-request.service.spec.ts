import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserAccessRequestService } from './user-access-request.service';
import { AccessRequestStatus } from '../enums/access-request-status.enum';

describe('UserAccessRequestService', () => {
  let service: UserAccessRequestService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserAccessRequestService]
    });

    service = TestBed.inject(UserAccessRequestService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create access request', () => {
    const mockRequest = {
      id: 1,
      requesterComment: 'Need access',
      permissions: ['chat:aviation:use'],
      roles: [],
      status: AccessRequestStatus.PENDING,
      reviewerName: '',
      reviewerComment: '',
      requestedDate: '2026-05-13T14:31:21.326Z',
      reviewedDate: null
    };

    service.createAccessRequest({
      requesterComment: 'Need access',
      permissions: ['chat:aviation:use']
    }).subscribe(result => {
      expect(result).toEqual(mockRequest);
    });

    const req = httpMock.expectOne(req => req.url.includes('/me/access-requests'));
    expect(req.request.method).toBe('POST');
    req.flush(mockRequest);
  });

  it('should get all user access requests', () => {
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

    const req = httpMock.expectOne(req => req.url.includes('/me/access-requests'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should get user access requests by status', () => {
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

    const req = httpMock.expectOne(req => req.url.includes('/me/access-requests/status/PENDING'));
    expect(req.request.method).toBe('GET');
    req.flush(mockPage);
  });

  it('should cancel user access request', () => {
    service.cancelAccessRequest(1).subscribe();

    const req = httpMock.expectOne(req => req.url.includes('/me/access-requests/1/cancel'));
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });
});
