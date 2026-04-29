import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { OauthSuccessComponent } from './oauth-success.component';
import { AuthService } from '../../../core/services/auth.service';

describe('OauthSuccessComponent', () => {
  let component: OauthSuccessComponent;
  let fixture: ComponentFixture<OauthSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthSuccessComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ token: 'test-token' })
            }
          }
        },
        {
          provide: AuthService,
          useValue: {
            completeOauth2Login: () => of(null)
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

    fixture = TestBed.createComponent(OauthSuccessComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
