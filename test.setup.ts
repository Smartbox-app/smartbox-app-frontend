const localStorageMock = {
  getItem: jest.fn((key?: string) =>
    key === 'language' ? JSON.stringify('pl') : null,
  ),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
});
