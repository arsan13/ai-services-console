import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewerApprovalsComponent } from './viewer-approvals.component';

describe('ViewerApprovalsComponent', () => {
  let component: ViewerApprovalsComponent;
  let fixture: ComponentFixture<ViewerApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewerApprovalsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewerApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
