import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthCallbackComponent } from './auth-callback.component';
import { AuthService } from '../../core/services/auth.service';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { setupLocalStorageMock, setupSessionStorageMock } from '../../../test-setup';

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let authService: AuthService;
  let router: Router;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        queryParams: {}
      }
    };

    setupLocalStorageMock();
    setupSessionStorageMock();

    TestBed.configureTestingModule({
      providers: [
        AuthCallbackComponent,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    });

    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
    component = TestBed.inject(AuthCallbackComponent);

    vi.spyOn(router, 'navigate').mockResolvedValue(true);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when no code provided', () => {
    component.ngOnInit();

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe('No authorization code received');
  });

  it('should handle successful callback', () => {
    mockActivatedRoute.snapshot.queryParams = { code: 'test-code' };
    vi.spyOn(authService, 'handleCallback').mockReturnValue(of(undefined));

    component.ngOnInit();

    expect(authService.handleCallback).toHaveBeenCalledWith('test-code');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should handle callback error', () => {
    mockActivatedRoute.snapshot.queryParams = { code: 'test-code' };
    vi.spyOn(authService, 'handleCallback').mockReturnValue(
      throwError(() => new Error('Authentication failed'))
    );

    component.ngOnInit();

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBe('Authentication failed');
  });

  it('should validate state parameter', () => {
    mockActivatedRoute.snapshot.queryParams = { code: 'test-code', state: 'test-state' };
    vi.spyOn(authService, 'validateState').mockReturnValue(false);

    component.ngOnInit();

    expect(component.isLoading()).toBe(false);
    expect(component.error()).toContain('Invalid state parameter');
  });

  it('should retry on error', () => {
    vi.spyOn(authService, 'login').mockImplementation(() => {});

    component.retry();

    expect(authService.login).toHaveBeenCalled();
  });
});
