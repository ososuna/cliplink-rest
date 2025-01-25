import type { Mock } from 'vitest';

declare global {
  function asMock<T>(fn: T): Mock;
}

export {};