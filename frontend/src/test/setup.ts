import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

function createStorageMock() {
  const store = new Map<string, string>()
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    get length() { return store.size },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
  }
}

if (typeof window !== 'undefined') {
  const localStorageMock = createStorageMock()
  const sessionStorageMock = createStorageMock()

  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })
  Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })
  Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock, writable: true })
  Object.defineProperty(globalThis, 'sessionStorage', { value: sessionStorageMock, writable: true })

  // Mock global fetch to instantly return ok: false so tests don't hang on offline backend network timeouts
  globalThis.fetch = vi.fn().mockImplementation(() =>
    Promise.resolve({
      ok: false,
      json: async () => ({}),
      text: async () => '',
    })
  )

  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
}

