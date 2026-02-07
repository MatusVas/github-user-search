import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';
import { vi } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockStorage: Map<string, string>;
  let mockSessionStorage: Map<string, string>;

  beforeEach(() => {
    // Mock localStorage
    mockStorage = new Map();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => mockStorage.get(key) || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockStorage.set(key, value);
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
      mockStorage.delete(key);
    });

    // Mock sessionStorage
    mockSessionStorage = new Map();
    const originalSessionStorage = window.sessionStorage;
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: (key: string) => mockSessionStorage.get(key) || null,
        setItem: (key: string, value: string) => mockSessionStorage.set(key, value),
        removeItem: (key: string) => mockSessionStorage.delete(key),
        clear: () => mockSessionStorage.clear(),
        get length() { return mockSessionStorage.size; },
        key: (index: number) => Array.from(mockSessionStorage.keys())[index] || null
      },
      writable: true,
      configurable: true
    });

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with no token', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.getToken()).toBeNull();
  });

  it('should load token from localStorage on init', () => {
    mockStorage.set('github_access_token', 'test-token');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    const newService = TestBed.inject(AuthService);

    expect(newService.getToken()).toBe('test-token');
    expect(newService.isAuthenticated()).toBe(true);
  });

  it('should handle callback and store token', () => {
    const code = 'test-code';
    const accessToken = 'test-access-token';

    service.handleCallback(code).subscribe({
      next: () => {
        expect(service.getToken()).toBe(accessToken);
        expect(service.isAuthenticated()).toBe(true);
        expect(mockStorage.get('github_access_token')).toBe(accessToken);
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/github/token');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ code });
    req.flush({ access_token: accessToken });
  });

  it('should handle callback error', () => {
    const code = 'test-code';

    service.handleCallback(code).subscribe({
      next: () => { throw new Error('should have failed'); },
      error: (error) => {
        expect(error.message).toBe('Authentication failed');
      }
    });

    const req = httpMock.expectOne('http://localhost:3000/api/auth/github/token');
    req.flush('Error', { status: 500, statusText: 'Server Error' });
  });

  it('should clear token on logout', () => {
    mockStorage.set('github_access_token', 'test-token');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    });
    const newService = TestBed.inject(AuthService);

    expect(newService.getToken()).toBe('test-token');

    newService.logout();

    expect(newService.getToken()).toBeNull();
    expect(newService.isAuthenticated()).toBe(false);
    expect(mockStorage.has('github_access_token')).toBe(false);
  });

  it('should validate state parameter', () => {
    const state = 'test-state';
    mockSessionStorage.set('github_oauth_state', state);

    expect(service.validateState(state)).toBe(true);
    expect(service.validateState('wrong-state')).toBe(false);
  });
});
