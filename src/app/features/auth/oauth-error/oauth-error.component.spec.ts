import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { OauthErrorComponent } from './oauth-error.component';

describe('OauthErrorComponent', () => {
  let component: OauthErrorComponent;
  let fixture: ComponentFixture<OauthErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthErrorComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ message: 'Authentication failed' })
            }
          }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: () => void 0
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OauthErrorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
