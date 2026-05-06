import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, provideRouter, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { OauthSuccessComponent } from './oauth-success.component';
import { Oauth2Service } from '../../../core/services/oauth2.service';

describe('OauthSuccessComponent', () => {
  let component: OauthSuccessComponent;
  let fixture: ComponentFixture<OauthSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OauthSuccessComponent],
      providers: [
        provideRouter([
          { path: 'chat', component: OauthSuccessComponent },
          { path: 'login', component: OauthSuccessComponent }
        ]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({ token: 'test-token' })
            }
          }
        },
        {
          provide: Oauth2Service,
          useValue: {
            completeLogin: () => of(null)
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
