import type { Mock } from 'vitest';

export function asMock<T>(fn: T): Mock {
  return fn as unknown as Mock;
}
