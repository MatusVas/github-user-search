import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ThemeService]
    });
  });

  afterEach(() => {
    localStorage.clear();
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
    localStorage.setItem('theme', 'dark');
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
    expect(localStorage.getItem('theme')).toBe('dark');

    service.toggleTheme();
    expect(localStorage.getItem('theme')).toBe('light');
  });
});
