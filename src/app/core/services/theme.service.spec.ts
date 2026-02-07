import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { setupLocalStorageMock, setupMatchMediaMock } from '../../../test-setup';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockStorage: Map<string, string>;

  beforeEach(() => {
    mockStorage = setupLocalStorageMock();
    setupMatchMediaMock();
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should initialize with light theme by default', () => {
    service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');
  });

  it('should initialize from localStorage if available', () => {
    mockStorage.set('theme', 'dark');

    TestBed.resetTestingModule();
    mockStorage = setupLocalStorageMock();
    mockStorage.set('theme', 'dark');
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
    service = TestBed.inject(ThemeService);

    expect(service.theme()).toBe('dark');
  });

  it('should toggle between light and dark', () => {
    service = TestBed.inject(ThemeService);
    expect(service.theme()).toBe('light');

    service.toggleTheme();
    expect(service.theme()).toBe('dark');

    service.toggleTheme();
    expect(service.theme()).toBe('light');
  });

  it('should set data-theme attribute on document', () => {
    service = TestBed.inject(ThemeService);
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');

    service.toggleTheme();
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('should persist theme to localStorage', () => {
    service = TestBed.inject(ThemeService);
    service.toggleTheme();
    expect(mockStorage.get('theme')).toBe('dark');

    service.toggleTheme();
    expect(mockStorage.get('theme')).toBe('light');
  });
});
