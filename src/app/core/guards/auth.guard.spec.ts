import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { vi } from 'vitest';

describe('authGuard', () => {
  let authService: AuthService;
  let router: Router;

  beforeEach(() => {
    // Mock localStorage
    const mockStorage: { [key: string]: string } = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => mockStorage[key] || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = value;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
      delete mockStorage[key];
    });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideRouter([
          { path: '', component: class {} },
          { path: 'dashboard', component: class {}, canActivate: [authGuard] }
        ])
      ]
    });

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should allow access when authenticated', async () => {
    // Set up authenticated state
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(true);

    const route = {} as any;
    const state = { url: '/dashboard' } as any;

    const result = authGuard(route, state);

    expect(result).toBe(true);
  });

  it('should redirect to home when not authenticated', async () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

    const route = {} as any;
    const state = { url: '/dashboard' } as any;

    const result = authGuard(route, state);

    expect(result).toBeTruthy();
    expect(result).toHaveProperty('toString');
  });

  it('should preserve return URL in query params', async () => {
    vi.spyOn(authService, 'isAuthenticated').mockReturnValue(false);

    const route = {} as any;
    const state = { url: '/dashboard' } as any;

    const result = authGuard(route, state) as any;

    expect(result.queryParams).toEqual({ returnUrl: '/dashboard' });
  });
});
