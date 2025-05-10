import { vi } from 'vitest';
import { asMock } from './test-utils/test-utils';

globalThis.asMock = asMock;

vi.mock('env-var', () => ({
  get: vi.fn((key: string) => ({
    required: vi.fn().mockReturnValue({
      asPortNumber: vi.fn().mockReturnValue(3000),
      asString: vi.fn().mockReturnValue(key === 'WEB_APP_URL' ? 'https://www.cliplink.app' : 'dummy-value'),
    }),
  })),
}));
