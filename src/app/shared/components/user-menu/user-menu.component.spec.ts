import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { UserMenuComponent } from './user-menu.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

describe('UserMenuComponent', () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  const authServiceMock = {
    logout: () => void 0
  };

  const userServiceMock = {
    currentUser: () => null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout and navigate to login', () => {
    const auth = TestBed.inject(AuthService);
    const router = TestBed.inject(Router);

    const logoutSpy = spyOn(auth, 'logout');
    const navigateSpy = spyOn(router, 'navigate').and.resolveTo(true);

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });
});
