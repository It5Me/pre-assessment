declare module 'jest-fetch-mock' {
  const fetchMock: {
    enableMocks(): void;
    disableMocks(): void;
    mockResponseOnce(body: string, init?: ResponseInit): void;
    mockRejectOnce(error?: Error): void;
    resetMocks(): void;
  };
  export = fetchMock;
}
