import { vi } from 'vitest';

// Setup window.matchMedia mock
export function setupMatchMediaMock() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Setup global test utilities
export function setupLocalStorageMock() {
  const mockStorage = new Map<string, string>();

  const localStorageMock = {
    getItem: (key: string) => mockStorage.get(key) || null,
    setItem: (key: string, value: string) => mockStorage.set(key, value),
    removeItem: (key: string) => mockStorage.delete(key),
    clear: () => mockStorage.clear(),
    get length() { return mockStorage.size; },
    key: (index: number) => Array.from(mockStorage.keys())[index] || null
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
    configurable: true
  });

  return mockStorage;
}

export function setupSessionStorageMock() {
  const mockSessionStorage = new Map<string, string>();

  const sessionStorageMock = {
    getItem: (key: string) => mockSessionStorage.get(key) || null,
    setItem: (key: string, value: string) => mockSessionStorage.set(key, value),
    removeItem: (key: string) => mockSessionStorage.delete(key),
    clear: () => mockSessionStorage.clear(),
    get length() { return mockSessionStorage.size; },
    key: (index: number) => Array.from(mockSessionStorage.keys())[index] || null
  };

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
    configurable: true
  });

  return mockSessionStorage;
}
