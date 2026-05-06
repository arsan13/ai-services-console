import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';
import { UserService } from './core/services/user.service';
import { ThemeService } from './core/services/theme.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([
          { path: 'chat', component: AppComponent },
          { path: 'login', component: AppComponent }
        ]),
        {
          provide: AuthService,
          useValue: {
            initializeUser: () => of(null),
            isLoggedIn: () => false
          }
        },
        {
          provide: UserService,
          useValue: {
            currentUser: () => null
          }
        },
        {
          provide: ThemeService,
          useValue: {
            initialize: () => void 0
          }
        }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain('AI');
  });
});
