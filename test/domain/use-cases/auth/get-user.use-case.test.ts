import { beforeAll, describe, expect, it, vi } from 'vitest';
import { AuthRepository, GetUser } from '@/domain';
import { AuthRepositoryImpl, AuthDataSourceImpl } from '@/infrastructure';
import { AuthDataSourceMocks } from '@test/test-utils';

describe('get user use case', () => {
  let authRepository: AuthRepository;
  const shortIdGenerator = vi.fn(() => 'shortId');

  beforeAll(() => {
    authRepository = new AuthRepositoryImpl(new AuthDataSourceImpl(shortIdGenerator));
  });

  it('should get user', async () => {
    const expectedUser = AuthDataSourceMocks.user;
    vi.spyOn(authRepository, 'getUser').mockResolvedValue(expectedUser);
    const result = await new GetUser(authRepository).execute('userId');
    expect(result).toEqual({
      id: 'userId',
      name: 'name',
      lastName: 'lastName',
      email: 'email',
    });
  });
});
