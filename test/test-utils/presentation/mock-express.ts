import { Request, Response } from 'express';
import { vi } from 'vitest';

export const createMockRequest = (overrides: Partial<Request> = {}): Partial<Request> => ({
  body: {},
  cookies: {},
  headers: {},
  method: 'GET',
  params: {},
  query: {},
  route: {},
  signedCookies: {},
  url: '/',
  ...overrides,
});

export const createMockResponse = (overrides: Partial<Response> = {}): Partial<Response> => ({
  json: vi.fn(),
  status: vi.fn().mockReturnThis(),
  send: vi.fn(),
  sendStatus: vi.fn(),
  cookie: vi.fn().mockReturnValue({
    send: vi.fn(),
  }),
  clearCookie: vi.fn(),
  redirect: vi.fn(),
  set: vi.fn(),
  get: vi.fn(),
  links: vi.fn(),
  jsonp: vi.fn(),
  sendFile: vi.fn(),
  download: vi.fn(),
  end: vi.fn(),
  format: vi.fn(),
  getHeader: vi.fn(),
  getHeaders: vi.fn(),
  setHeader: vi.fn(),
  removeHeader: vi.fn(),
  type: vi.fn(),
  vary: vi.fn(),
  attachment: vi.fn(),
  app: {} as any,
  req: {} as any,
  locals: {},
  headersSent: false,
  statusCode: 200,
  statusMessage: 'OK',
  ...overrides,
});
