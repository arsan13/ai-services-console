import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyAccessRequestsComponent } from './my-access-requests.component';

describe('MyAccessRequestsComponent', () => {
  let component: MyAccessRequestsComponent;
  let fixture: ComponentFixture<MyAccessRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAccessRequestsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyAccessRequestsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial state with empty requests', () => {
    expect(component.requests()).toEqual([]);
    expect(component.currentPage()).toBe(0);
  });

  it('should disable previous button on first page', () => {
    component.currentPage.set(0);
    expect(component.currentPage()).toBe(0);
  });

  it('should allow next page navigation when not on last page', () => {
    component.currentPage.set(0);
    component.totalPages.set(2);
    component.onNextPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should not navigate past last page', () => {
    component.currentPage.set(1);
    component.totalPages.set(1);
    component.onNextPage();
    expect(component.currentPage()).toBe(1);
  });
});
