import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthDataSourceImpl } from '@/infrastructure';
import { AuthController } from '@/presentation/auth/controller';

describe('auth controller', () => {

  let authController: AuthController;

  beforeAll(() => {
    const shortIdGenerator = vi.fn(() => 'shortId');
    authController = new AuthController(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

});