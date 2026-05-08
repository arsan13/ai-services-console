import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationBannerComponent } from './verification-banner.component';

describe('VerificationBannerComponent', () => {
  let component: VerificationBannerComponent;
  let fixture: ComponentFixture<VerificationBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerificationBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(VerificationBannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
