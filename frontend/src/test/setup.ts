import '@testing-library/jest-dom'

if (typeof window !== 'undefined') {
  const store = new Map<string, string>()
  const localStorageMock = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, String(value)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    get length() { return store.size },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
  }
  Object.defineProperty(window, 'localStorage', { value: localStorageMock, writable: true })
  Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock, writable: true })
}
