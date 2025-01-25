import { vi } from 'vitest';
import { asMock } from './test-utils';

globalThis.asMock = asMock;

vi.mock("env-var", () => ({
  get: vi.fn(() => ({
    required: vi.fn().mockReturnValue({
      asPortNumber: vi.fn().mockReturnValue(3000),
      asString: vi.fn().mockReturnValue("dummy-value"),
    }),
  })),
}));