import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminApprovalsComponent } from './admin-approvals.component';

describe('AdminApprovalsComponent', () => {
  let component: AdminApprovalsComponent;
  let fixture: ComponentFixture<AdminApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminApprovalsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminApprovalsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial state with empty requests', () => {
    expect(component.requests()).toEqual([]);
    expect(component.currentPage()).toBe(0);
  });

  it('should track processing state for requests', () => {
    expect(component.isProcessing(1)).toBeFalsy();
  });

  it('should require reviewer comment', () => {
    component.updateReviewerComment(10, '');
    expect(component.hasReviewerComment(10)).toBeFalsy();
    component.updateReviewerComment(10, 'approved');
    expect(component.hasReviewerComment(10)).toBeTruthy();
  });

  it('should allow navigation between pages', () => {
    component.currentPage.set(0);
    component.totalPages.set(2);
    component.onNextPage();
    expect(component.currentPage()).toBe(1);
    component.onPreviousPage();
    expect(component.currentPage()).toBe(0);
  });
});
